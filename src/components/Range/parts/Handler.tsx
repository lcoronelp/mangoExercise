import * as React from "react"

interface Props {
    currentPosition: number,

    currentActive: boolean,
    handlerRef: React.MutableRefObject<any>

    onActive: Function,
    onInactive: Function,
}

export const Handler = (props: Props): JSX.Element => {
    const handleActive = () => {
        props.onActive()
    }
    const handleInactive = () => {
        if(props.handlerRef.current) {
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
            onMouseDown={handleActive}
            onMouseUp={handleInactive}
        >
            <span/>
        </button>
    )
}
