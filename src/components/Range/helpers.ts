export const parseNumber = (number: string) => {
    return +number
}

export const isValid = (value: number, minValue: number | undefined, maxValue: number | undefined) => {
    if (typeof (minValue) === "undefined" || typeof (maxValue) === "undefined") {
        throw new Error("MinValue or MaxValue isn't defined")
    }

    return value >= minValue && value <= maxValue
}

export const calculatePercentFromValue = (value: number, minValue: number | undefined, maxValue: number | undefined) => {
    if (typeof (minValue) === "undefined" || typeof (maxValue) === "undefined") {
        throw new Error("MinValue or MaxValue isn't defined")
    }


    return (value - minValue) / (maxValue - minValue) * 100
}

export const calculateValueFromPercent = (value: number, minValue: number | undefined, maxValue: number | undefined) => {
    if (typeof (minValue) === "undefined" || typeof (maxValue) === "undefined") {
        throw new Error("MinValue or MaxValue isn't defined")
    }


    return ((maxValue - minValue) * value / 100) + minValue
}

export const calculatePercentFromPosition = (value: number, minValue: number, maxValue: number) => {
    let percentValue = (value - minValue) / (maxValue - minValue) * 100
    percentValue = percentValue > 100 ? 100 : percentValue
    percentValue = percentValue < 0 ? 0 : percentValue

    return percentValue

}

export const truncateDecimals = (value: number, decimalQuantity: number = 2): number => {
    const divisor: number = Math.pow(10, decimalQuantity)
    return Math.round(value * divisor) / divisor
}





