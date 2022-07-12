import * as React from 'react'
import {debounce} from 'lodash'

import {HandlerActive, reducer, reducerActions, reducerData, reducerInitialData} from "./reducer"
import {Label} from "./parts/Label"

import "./Range.scss"
import {RangeSlider} from "./parts/RangeSlider"
import {isValid} from "./helpers"
import {getConfig} from "./ws"
import {Loading} from "../../common/Loading";

const styles: { [key: string]: React.CSSProperties } = {
    wrapper: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    }
}

interface Props {
    type: string
}

const Range = (props: Props) => {
    const [state, dispatch]: [state: reducerData, dispatch: Function] = React.useReducer(reducer, reducerInitialData)

    React.useEffect(() => {
        getConfig(props.type)
            .then((jsonData) => {
                if (jsonData) {
                    dispatch({
                        type: reducerActions.CONFIGURE,
                        payload: jsonData
                    })
                }
            })
    }, [])

    const handleValueRealChange = (value: number, isMinValue: boolean = false) => {
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
            const newValue = getNewValueConstraint(value, minValue, maxValue, isMinValue, state)

            dispatch({
                type: isMinValue ? reducerActions.CHANGE_CURRENT_MIN_FROM_VALUE : reducerActions.CHANGE_CURRENT_MAX_FROM_VALUE,
                payload: +newValue
            })
        }

    }

    const debouncedHandleValueChange = React.useMemo(() => debounce(handleValueRealChange, 300), [state])

    const handleHandlerStatusChange = (handlerActive:HandlerActive = null) => {
        dispatch({
            type: reducerActions.CHANGE_HANDLER_ACTIVE,
            payload: handlerActive
        })
    }

    const handlePercentChange = (percent: number, isMinPercent: boolean) => {

        if (isNaN(percent)) {
            return
        }

        if (
            (isMinPercent && !isValid(percent, 0, state.maxCurrentPosition))
            ||
            (!isMinPercent && !isValid(percent, state.minCurrentPosition, 100))
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
            payload: percent
        })
    }

    if (!state.rangeItems || state.rangeItems.length < 2) {
        return (
            <Loading/>
        )
    }

    return (
        <div className={"mRangeSelector"} style={styles.wrapper}>
            <Label
                aria={{label: "Min Value"}}
                value={state.minCurrentValue}
                valueDecimalPositions={state.decimalPositions}
                editable={state.editable}
                currencyOnLeft={state.currencyOnLeft}
                onChangeValue={(tentativeNewValue: number) => debouncedHandleValueChange(tentativeNewValue, true)}
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
                editable={state.editable}
                currencyOnLeft={state.currencyOnLeft}
                onChangeValue={(tentativeNewValue: number) => debouncedHandleValueChange(tentativeNewValue)}
            />
        </div>
    )
}

const getNewValueConstraint = (value: number, minValue: number, maxValue: number, isMinValue: boolean, state: reducerData) => {
    let newValue = value

    if (isMinValue) {
        if (value < minValue) {
            newValue = minValue
        }

        if (value > state.maxCurrentValue) {
            newValue = state.maxCurrentValue
        }
    }

    if (!isMinValue) {
        if (value < state.minCurrentValue) {
            newValue = state.minCurrentValue
        }

        if (value > maxValue) {
            newValue = maxValue
        }
    }

    return newValue
}

export default Range
