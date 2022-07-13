import * as React from 'react'
import {calculatePercentFromValue, calculateValueFromPercent, truncateDecimals} from "./helpers"

export type HandlerActive = "min" | "max" | null

export enum reducerActions {
    RECONFIGURE = "reconfigure",
    CHANGE_HANDLER_ACTIVE = "changeHandlerActive",
    CHANGE_CURRENT_MIN_FROM_VALUE = "changeCurrentMinValue",
    CHANGE_CURRENT_MAX_FROM_VALUE = "changeCurrentMaxValue",
    CHANGE_CURRENT_MIN_FROM_PERCENT = "changeCurrentMinPercent",
    CHANGE_CURRENT_MAX_FROM_PERCENT = "changeCurrentMaPercent"
}

export type reducerData = {
    type: "simple" | "multiple"

    minCurrentValue: number
    maxCurrentValue: number

    minCurrentPosition: number
    maxCurrentPosition: number

    rangeItems: number[]
    rangeItemsPositions: number[]

    handlerActive: HandlerActive

    editable: boolean,
    locale: string
    decimalPositions: number

    currency: string
    currencyOnLeft: boolean
}

export type reducerAction = {
    type: reducerActions,
    payload: any
}

export const reducerInitialData: reducerData = {
    type: "simple",

    minCurrentValue: 0,
    maxCurrentValue: 0,

    minCurrentPosition: 0,
    maxCurrentPosition: 0,

    rangeItems: [],
    rangeItemsPositions: [],

    handlerActive: null,

    editable: true,
    locale: "en",
    decimalPositions: 2,

    currency: "€",
    currencyOnLeft: false
}

export const reducer: React.Reducer<reducerData, reducerAction> = (state: reducerData, action: reducerAction): reducerData => {
    switch (action.type) {

        case reducerActions.RECONFIGURE: {
            const newState: reducerData = {
                ...state,
                ...action.payload as reducerData
            }

            newState.minCurrentValue = action.payload.minCurrentValue ?? newState.rangeItems.at(0)
            newState.maxCurrentValue = action.payload.maxCurrentValue ?? newState.rangeItems.at(-1)

            newState.minCurrentPosition = calculatePercentFromValue(newState.minCurrentValue, newState.rangeItems.at(0), newState.rangeItems.at(-1))
            newState.maxCurrentPosition = calculatePercentFromValue(newState.maxCurrentValue, newState.rangeItems.at(0), newState.rangeItems.at(-1))

            newState.rangeItemsPositions = newState.rangeItems.map((rangeItem)=>{
                return calculatePercentFromValue(rangeItem, newState.rangeItems.at(0), newState.rangeItems.at(-1))
            })

            return newState
        }

        case reducerActions.CHANGE_HANDLER_ACTIVE: {
            return {
                ...state,
                handlerActive: action.payload
            } as reducerData
        }

        case reducerActions.CHANGE_CURRENT_MIN_FROM_VALUE: {
            return {
                ...state,
                minCurrentValue: truncateDecimals(action.payload, state.decimalPositions),
                minCurrentPosition: calculatePercentFromValue(action.payload as number, state.rangeItems.at(0), state.rangeItems.at(-1))
            } as reducerData
        }

        case reducerActions.CHANGE_CURRENT_MAX_FROM_VALUE: {
            return {
                ...state,
                maxCurrentValue: truncateDecimals(action.payload, state.decimalPositions),
                maxCurrentPosition: calculatePercentFromValue(action.payload as number, state.rangeItems.at(0), (state.rangeItems.at(-1) ?? 0))
            } as reducerData
        }

        case reducerActions.CHANGE_CURRENT_MIN_FROM_PERCENT: {
            return {
                ...state,
                minCurrentValue: truncateDecimals(calculateValueFromPercent(action.payload as number, state.rangeItems.at(0), (state.rangeItems.at(-1) ?? 0)), state.decimalPositions),
                minCurrentPosition: action.payload as number
            } as reducerData
        }

        case reducerActions.CHANGE_CURRENT_MAX_FROM_PERCENT: {
            return {
                ...state,
                maxCurrentValue: truncateDecimals(calculateValueFromPercent(action.payload as number, state.rangeItems.at(0), (state.rangeItems.at(-1) ?? 0)), state.decimalPositions),
                maxCurrentPosition: action.payload as number
            } as reducerData
        }

        default:
            return state
    }
}
