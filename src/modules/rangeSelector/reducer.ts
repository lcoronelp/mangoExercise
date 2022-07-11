import * as React from 'react'
import {calculatePosition} from "./helpers";

export enum reducerActions {
    CONFIGURE = "initialDefinition",
    CHANGE_CURRENT_MIN = "changeCurrentMinValue",
    CHANGE_CURRENT_MAX = "changeCurrentMaxValue"
}

export type reducerData = {
    minCurrentValue: number
    maxCurrentValue: number

    minCurrentPosition: number
    maxCurrentPosition: number

    minValue: number
    maxValue: number
    rangeItems: number[]

    locale: string
    decimalPositions: number

    currency: string
    currencyOnLeft: boolean
}

export type reducerAction = {
    type: reducerActions,
    payload: any // TODO
}

export const reducerInitialData: reducerData = {
    minCurrentValue: 0,
    maxCurrentValue: 100, // TODO

    minCurrentPosition:0,
    maxCurrentPosition:100,

    minValue: 0,
    maxValue: 100, // TODO
    rangeItems: [],

    locale: "en",
    decimalPositions: 2, // TODO

    currency: "€",
    currencyOnLeft: false
}

export const reducer: React.Reducer<reducerData, reducerAction> = (state: reducerData, action: reducerAction): reducerData => {
    switch (action.type) {

        case reducerActions.CONFIGURE: {
            const newState: reducerData = {
                ...state,
                ...action.payload as reducerData
            }

            newState.minCurrentValue = action.payload.minCurrentValue ?? state.minValue
            newState.maxCurrentValue = action.payload.maxCurrentValue ?? state.maxValue

            return newState
        }

        case reducerActions.CHANGE_CURRENT_MIN: {
            return {
                ...state,
                minCurrentValue: action.payload as number,
                minCurrentPosition:calculatePosition(action.payload as number,state.minValue,state.maxValue)
            } as reducerData
        }

        case reducerActions.CHANGE_CURRENT_MAX: {
            return {
                ...state,
                maxCurrentValue: action.payload as number,
                maxCurrentPosition:calculatePosition(action.payload as number,state.minValue,state.maxValue)
            } as reducerData
        }

        default:
            return state
    }
}
