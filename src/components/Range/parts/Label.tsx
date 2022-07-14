import * as React from "react"
import {parseNumber} from "../helpers";

interface Props {
    value: number
    valueDecimalPositions?: number
    onChangeValue: Function

    biggestValue: number

    editable?: boolean

    currency?: string
    currencyOnLeft?: boolean

    aria: {
        label: string
    }
}

export const Label = (props: Props): JSX.Element => {
    const currency = props.currency ?? "€"
    const currencyOnLeft = props.currencyOnLeft ?? false

    const inputRef = React.useRef(null)
    const [characters, setCharacters] = React.useState(0)

    const [value, setValue] = React.useState(props.value.toString())
    const [prevValue, setPrevValue] = React.useState(props.value.toString())

    const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        if (!props.editable) {
            return
        }

        const target: HTMLInputElement = e.target as HTMLInputElement

        const valueNumber = parseNumber(target.value)

        if (isNaN(valueNumber)) {
            return
        }

        setValue(target.value)
        return props.onChangeValue(target.value, prevValue)
    }

    React.useEffect(() => {
        const content: string = (inputRef.current as unknown as HTMLInputElement).value
        setCharacters(content.length)
    }, [inputRef.current, value])

    React.useEffect(() => {
        setValue(props.value.toString())
        setPrevValue(props.value.toString())
    }, [props.value])

    let input = (
        <input
            ref={inputRef}
            value={value}
            onInput={handleInputChange}
            aria-label={props.aria.label}
            title={props.aria.label}
            className={`mRangeSelector__label__input`}
            style={{
                "--characters": characters,
                "--minimalCharacters": props.biggestValue.toFixed(props.valueDecimalPositions ?? 2).length
            } as React.CSSProperties}
        />
    )

    if (!props.editable) {
        input = (
            <output
                ref={inputRef}
                aria-label={props.aria.label}
                title={props.aria.label}
                className={`mRangeSelector__label__output`}
                style={{
                    "--characters": characters,
                    "--minimalCharacters": props.biggestValue.toFixed(props.valueDecimalPositions ?? 2).length
                } as React.CSSProperties}
            >
                {value}
            </output>
        )
    }

    return (
        <div
            className={`mRangeSelector__label ${currencyOnLeft ? 'mRangeSelector__label--currencyPosition-left' : ''}  ${props.editable ? 'mRangeSelector__label--editable' : ''}`}
        >
            {input}

            <span
                className={`mRangeSelector__label__currency`}
            >
                {currency}
            </span>
        </div>
    )
}
