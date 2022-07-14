import * as React from 'react'
import {debounce} from 'lodash'

import {HandlerActive, insertData, reducer, reducerActions, reducerData} from "./reducer"
import {Label} from "./parts/Label"

import "./Range.scss"
import {RangeSlider} from "./parts/RangeSlider"
import {isValid} from "./helpers"

const styles: { [key: string]: React.CSSProperties } = {
    wrapper: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    }
}

interface Props {
    initialData: any
}

const Range = (props: Props) => {
    const _isMounted = React.useRef(true)

    const initialData = insertData(props.initialData)

    const [state, dispatch]: [state: reducerData, dispatch: Function] = React.useReducer(reducer, initialData)

    const handleValueRealChange = (value: number, prevValue: number, isMinValue: boolean = false) => {
        if (_isMounted.current) {
            const minValue = state.rangeItems.at(0)
            const maxValue = state.rangeItems.at(-1)
            if (typeof (minValue) === "undefined" || typeof (maxValue) === "undefined") {
                throw new Error("MinValue or MaxValue isn't defined")
            }

            dispatch({
                type: isMinValue ? reducerActions.CHANGE_CURRENT_MIN_FROM_VALUE : reducerActions.CHANGE_CURRENT_MAX_FROM_VALUE,
                payload: +value
            })

            if (
                (isMinValue && !isValid(value, minValue, state.maxCurrentValue))
                ||
                (!isMinValue && !isValid(value, state.minCurrentValue, maxValue))
            ) {
                const newValue = getNewValueConstraint(value, minValue, maxValue, isMinValue, state, prevValue)

                dispatch({
                    type: isMinValue ? reducerActions.CHANGE_CURRENT_MIN_FROM_VALUE : reducerActions.CHANGE_CURRENT_MAX_FROM_VALUE,
                    payload: +newValue
                })
            }
        }

    }
    const debouncedHandleValueChange = React.useMemo(() => debounce(handleValueRealChange, 450), [state])

    const handleHandlerStatusChange = (handlerActive: HandlerActive = null) => {
        dispatch({
            type: reducerActions.CHANGE_HANDLER_ACTIVE,
            payload: handlerActive
        })
    }

    const calculatePercentChangeForMultiple = (testPercent: number, isMinPercent: boolean) => {
        let sortPositions = [...state.rangeItemsPositions]

        /** These comments were keep on purpose, testing two methods to find the closest item
         *  testing the performance of sort vs foreach with break
         *
         *  Results: Not much difference in small groups of positions, but with > 1000 positions the difference can be a little noticed
         *
         *  Uncomment the next comments to see the measurements (and use more than 1000 positions)
         **/

            // performance.mark("mark_initial")
            // const closestPositionBySort = calculateClosestPositionWithSort(testPercent, sortPositions)

            // performance.mark("mark_between")
        const closestPositionByForeach = calculateClosestPositionWithForeach(testPercent, sortPositions, isMinPercent)
        // performance.mark("mark_final")

        // performance.measure("Sort", "mark_initial", "mark_between")
        // performance.measure("Foreach", "mark_between", "mark_final")

        // console.log(performance.getEntriesByType("measure").map((measure: PerformanceEntry) => {
        //     return `${measure.name}: ${measure.duration}`
        // }).join("\n"))
        //
        // performance.clearMarks()
        // performance.clearMeasures()

        return closestPositionByForeach
    }

    const handlePercentChange = (percent: number, isMinPercent: boolean) => {
        if (isNaN(percent)) {
            return
        }

        let calculatedPercent = percent
        if (state.type === "multiple") {
            calculatedPercent = calculatePercentChangeForMultiple(percent, isMinPercent)
        }

        if (
            (isMinPercent && !isValid(calculatedPercent, 0, state.maxCurrentPosition))
            ||
            (!isMinPercent && !isValid(calculatedPercent, state.minCurrentPosition, 100))
        ) {
            dispatch({
                type: isMinPercent ? reducerActions.CHANGE_CURRENT_MIN_FROM_PERCENT : reducerActions.CHANGE_CURRENT_MAX_FROM_PERCENT,
                payload: isMinPercent ? state.maxCurrentPosition : state.minCurrentPosition
            })

            dispatch({
                type: reducerActions.CHANGE_HANDLER_ACTIVE,
                payload: state.handlerActive === "min" ? "max" : "min"
            })

            isMinPercent = !isMinPercent
        }


        dispatch({
            type: isMinPercent ? reducerActions.CHANGE_CURRENT_MIN_FROM_PERCENT : reducerActions.CHANGE_CURRENT_MAX_FROM_PERCENT,
            payload: calculatedPercent
        })

    }

    React.useEffect(() => {
        return () => {
            if(debouncedHandleValueChange.cancel) {
                debouncedHandleValueChange.cancel()
            }
            _isMounted.current = false
        }
    }, [])

    return (
        <div className={"mRangeSelector"} style={styles.wrapper}>
            <Label
                aria={{label: "Min Value"}}
                value={state.minCurrentValue}
                valueDecimalPositions={state.decimalPositions}
                biggestValue={state.rangeItems?.at(-1) ?? 0}
                editable={state.editable}
                currencyOnLeft={state.currencyOnLeft}
                onChangeValue={(tentativeNewValue: number, prevValue: number) => debouncedHandleValueChange(tentativeNewValue, prevValue, true)}
            />

            <RangeSlider
                minCurrentPosition={state.minCurrentPosition}
                maxCurrentPosition={state.maxCurrentPosition}
                handlerActive={state.handlerActive}
                onHandleStatusChange={handleHandlerStatusChange}
                onChangePercent={handlePercentChange}
                aria={{
                    minHandler: "Minimal selector",
                    maxHandler: "Maximum selector"
                }}
            />

            <Label
                aria={{label: "Max Value"}}
                value={state.maxCurrentValue}
                valueDecimalPositions={state.decimalPositions}
                biggestValue={state.rangeItems?.at(-1) ?? 0}
                editable={state.editable}
                currencyOnLeft={state.currencyOnLeft}
                onChangeValue={(tentativeNewValue: number, prevValue: number) => debouncedHandleValueChange(tentativeNewValue, prevValue)}
            />
        </div>
    )
}

const getNewValueConstraint = (value: number | string, minValue: number, maxValue: number, isMinValue: boolean, state: reducerData, prevValue: number) => {
    if (isMinValue) {

        if (value === "") {
            return minValue
        }

        if (value < minValue || value > state.maxCurrentValue) {
            return prevValue
        }
    }

    if (!isMinValue) {

        if (value === "") {
            return maxValue
        }


        if (value < state.minCurrentValue || value > maxValue) {
            return prevValue
        }
    }

    return value
}

const calculateClosestPositionWithSort = (testPosition: number, positions: number[]) => {
    positions.sort((aValue: number, bValue: number) => {
        return Math.abs(testPosition - aValue) - Math.abs(testPosition - bValue)
    })
    return positions[0]
}

const calculateClosestPositionWithForeach = (testPosition: number, positions: number[], isMinHandler = false) => {
    if (!isMinHandler) {
        positions = positions.reverse()
    }
    let closestPosition: number = 0
    let closestSeparation: number = Infinity

    const BreakExc = {}

    try {
        positions.forEach((position: number) => {
            const testSeparation = Math.abs(testPosition - position)
            if (testSeparation < closestSeparation) {
                closestPosition = position
                closestSeparation = testSeparation
            }
            if ((isMinHandler && testPosition < position) || (!isMinHandler && testPosition > position)) {
                throw BreakExc
            }
        })
    } catch (e) {
        if (e !== BreakExc) throw e
    }

    return closestPosition
}

export default Range
