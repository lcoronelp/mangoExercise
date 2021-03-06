import * as React from "react"

interface Props {
    currentPosition: number,

    currentActive: boolean,
    handlerRef: React.MutableRefObject<any>

    onActive: Function,
    onInactive: Function,

    aria: {
        label: string
    }

}

export const Handler = (props: Props): JSX.Element => {
    const handleActive = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (e.button !== 0) {
            return
        }
        props.onActive()
    }
    const handleInactive = () => {
        if (props.handlerRef.current) {
            (props.handlerRef.current as HTMLButtonElement).blur()
        }
        props.onInactive()
    }
    return (
        <button
            ref={props.handlerRef}
            className={`mRangeSelector__handler ${props.currentActive ? "mRangeSelector__handler--active" : ""}`}
            style={{
                ...{
                    "left": `${props.currentPosition ?? 0}%`
                } as React.CSSProperties
            }}
            aria-label={props.aria.label}
            onMouseDown={handleActive}
            onMouseUp={handleInactive}
        >
            <span/>
        </button>
    )
}
