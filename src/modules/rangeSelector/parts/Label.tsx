import * as React from "react"

interface Props {
    value: number | undefined
    onChangeValue: Function

    editable?: boolean

    currency?: string
    currencyOnLeft?: boolean

    aria: {
        label: string
    }
}

export const Label = (props: Props): JSX.Element => {
    const editable = props.editable ?? false
    const currency = props.currency ?? "€"
    const currencyOnLeft = props.currencyOnLeft ?? false

    const inputRef = React.useRef(null)
    const [characters,setCharacters] = React.useState(0)

    const handleClickWrapper = (e:any) => {
        console.log(e)
        // if(inputRef.current) {
        //     (inputRef.current as HTMLDivElement).focus()
        // }
    }
    const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        const target: HTMLInputElement = e.target as HTMLInputElement
        const content: string = target.value
        setCharacters(content.length)
        return props.onChangeValue(target.value)
    }

    React.useEffect(() => {
        const content: string = (inputRef.current as unknown as HTMLInputElement).value
        setCharacters(content.length)
    }, [inputRef.current])
    return (
        <div
            className={`mRangeSelector__label ${currencyOnLeft ? 'mRangeSelector__label--currencyPosition-left' : ''}`}
            onClick={handleClickWrapper}
        >
            <input
                ref={inputRef}
                value={props.value}
                onInput={handleInputChange}
                aria-label={props.aria.label}
                className={`mRangeSelector__label__input`}
                style={{"--characters":characters} as React.CSSProperties}
            />

            <span
                className={`mRangeSelector__label__currency`}
            >
                {currency}
            </span>
        </div>
    )
}
