import * as React from 'react'

import {reducer, reducerActions, reducerInitialData} from "./reducer"
import {Label} from "./parts/Label"

import "./module.scss"
import {Range} from "./parts/Range"
import {isValid, parseNumber} from "./helpers";

const styles: { [key: string]: React.CSSProperties } = {
    wrapper: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    }
}


const Module = () => {
    const [state, dispatch] = React.useReducer(reducer, reducerInitialData)


    React.useEffect(() => {
        //TODO: Do when WS
        dispatch({
            type: reducerActions.CONFIGURE,
            payload: {
                minValue: 0,
                maxValue: 100
            }
        })
    }, [])

    const handleValueChange = (value: string, isMinValue: boolean = false) => {

        //TODO Separate in two and delay with debounce
        const valueNumber = parseNumber(value) //TODO Add locale format

        if (isNaN(valueNumber)) {
            return
        }

        if (
            (isMinValue && !isValid(valueNumber, state.minValue, state.maxCurrentValue))
            ||
            (!isMinValue && !isValid(valueNumber, state.minCurrentValue, state.maxValue))
        ) {
            return
        }

        console.log("valueNumber",valueNumber)


        dispatch({
            type: isMinValue ? reducerActions.CHANGE_CURRENT_MIN : reducerActions.CHANGE_CURRENT_MAX,
            payload: valueNumber
        })
    }

    console.table(state)

    return (
        <div className={"mRangeSelector"} style={styles.wrapper}>
            <Label
                aria={{label: "Min Value"}}
                value={state.minCurrentValue}
                editable={false}
                currencyOnLeft={true}
                onChangeValue={(tentativeNewValue: string) => handleValueChange(tentativeNewValue, true)}
            />

            <Range
                minCurrentPosition={state.minCurrentPosition}
                maxCurrentPosition={state.maxCurrentPosition}
                aria={{
                    minHandler: "Minimal selector",
                    maxHandler: "Maximum selector"
                }}
            />

            <Label
                aria={{label: "Max Value"}}
                value={state.maxCurrentValue}
                editable={true}
                currencyOnLeft={false}
                onChangeValue={(tentativeNewValue: string) => handleValueChange(tentativeNewValue)}
            />
        </div>
    )
}

export default Module
