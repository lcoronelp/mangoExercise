export const parseNumber = (number: string) => {
    return +number
}

export const isValid = (value: number, minValue: number, maxValue: number) => {
    return value >= minValue && value <= maxValue
}

export const calculatePosition = (value: number, minValue: number, maxValue: number) => {
    //TODO: Sticky to defined points
    return (maxValue - minValue) * value /100
}

