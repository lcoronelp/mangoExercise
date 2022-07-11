import * as React from "react"
import {Handler} from "./Handler"

const styles: { [key: string]: React.CSSProperties } = {
    wrapper: {
        position: "relative",
        flex: "1 1 auto",
        height: 40,
        paddingBlock: 15,
        marginInline: 20,
        cursor: "pointer"
    },
    backgroundBar: {
        position: "absolute",
        pointerEvents: "none",
        height: 10,
        left:0,
        width:"100%",
        background: "var(--barColor)",
        borderRadius: "60vw",
    },
    selectedBar: {
        position: "absolute",
        pointerEvents: "none",
        height: 10,
        background: "var(--activeColor)"
    }
}

interface Props {

    minCurrentPosition: number,
    maxCurrentPosition: number,

    aria: {
        minHandler: string,
        maxHandler: string,
    }
}


export const Range = (props: Props): JSX.Element => {
    return (

        <div
            style={{
                ...styles.wrapper
            }}
        >

            <div style={styles.backgroundBar}/>

            <div style={{
                ...styles.selectedBar,
                ...{
                    "left": `${props.minCurrentPosition}%`,
                    "right": `calc(100% - ${props.maxCurrentPosition}%)`
                } as React.CSSProperties
            }
            }/>

            <Handler currentPosition={props.minCurrentPosition}/>

            <Handler currentPosition={props.maxCurrentPosition}/>

        </div>
    )
}
