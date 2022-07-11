import * as React from "react"


interface Props {

    currentPosition: number
}

export const Handler = (props: Props): JSX.Element => {
    return (
        <div
            className={"mRangeSelector__handler"}
            style={{
                ...{
                    "left": `${props.currentPosition ?? 0}%`
                } as React.CSSProperties
            }}
        >
            <span/>
        </div>
    )
}
