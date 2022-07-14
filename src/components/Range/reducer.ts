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
    error: false | string
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
    error: false,
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
            return insertData(action.payload, state)
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
                minCurrentPosition: calculatePercentFromValue(action.payload as number, state.rangeItems.at(0) as number, state.rangeItems.at(-1) as number)
            } as reducerData
        }

        case reducerActions.CHANGE_CURRENT_MAX_FROM_VALUE: {
            return {
                ...state,
                maxCurrentValue: truncateDecimals(action.payload, state.decimalPositions),
                maxCurrentPosition: calculatePercentFromValue(action.payload as number, state.rangeItems.at(0) as number, state.rangeItems.at(-1) as number)
            } as reducerData
        }

        case reducerActions.CHANGE_CURRENT_MIN_FROM_PERCENT: {
            return {
                ...state,
                minCurrentValue: truncateDecimals(calculateValueFromPercent(action.payload as number, state.rangeItems.at(0) as number, state.rangeItems.at(-1) as number), state.decimalPositions),
                minCurrentPosition: action.payload as number
            } as reducerData
        }

        case reducerActions.CHANGE_CURRENT_MAX_FROM_PERCENT: {
            return {
                ...state,
                maxCurrentValue: truncateDecimals(calculateValueFromPercent(action.payload as number, state.rangeItems.at(0) as number, state.rangeItems.at(-1) as number), state.decimalPositions),
                maxCurrentPosition: action.payload as number
            } as reducerData
        }

        default:
            return state
    }
}

export const insertData = (newData: reducerData, prevData = reducerInitialData) => {

    const newState: reducerData = {
        ...prevData,
        ...newData
    }

    try {
        if (!newState.rangeItems || newState.rangeItems.length < 2) {
            throw new Error("The webservice don't return the minimum data to work")
        }

        if (newState.rangeItems.some((item: any) => typeof item !== "number")) {
            throw new Error("Some of the items in 'rangeItems' returned by the webservice are not numbers")
        }

        // Verify the order of items
        const rangeItems = [...newState.rangeItems]
        rangeItems.sort((a: number, b: number) => a - b)
        newState.rangeItems = rangeItems

        const minValue = newState.rangeItems.at(0) as number
        const maxValue = newState.rangeItems.at(-1) as number

        newState.minCurrentValue = newData.minCurrentValue ?? minValue
        newState.maxCurrentValue = newData.maxCurrentValue ?? maxValue

        newState.minCurrentPosition = calculatePercentFromValue(newState.minCurrentValue, minValue, maxValue)
        newState.maxCurrentPosition = calculatePercentFromValue(newState.maxCurrentValue, minValue, maxValue)

        newState.rangeItemsPositions = newState.rangeItems.map((rangeItem) => {
            return calculatePercentFromValue(rangeItem, minValue, maxValue)
        })

        newState.type = newState.rangeItems.length === 2 ? "simple" : "multiple"
        newState.editable = newState.rangeItems.length === 2

    } catch (e: any) {
        newState.error = e.toString()
    }

    return newState
}
