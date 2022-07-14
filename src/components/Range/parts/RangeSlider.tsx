import * as React from "react"
import {Handler} from "./Handler"
import {calculatePercentFromPosition} from "../helpers"
import {HandlerActive} from "../reducer"

const styles: { [key: string]: React.CSSProperties } = {
    wrapper: {
        position: "relative",
        flex: "1 1 auto",
        height: 40,
        paddingBlock: 15,
        marginInline: 20,
        cursor: "pointer",
        zIndex: 1
    },
    backgroundBar: {
        position: "absolute",
        height: 10,
        left: 0,
        width: "100%",
        background: "var(--barColor)",
        borderRadius: "60vw"
    },
    selectedBar: {
        position: "absolute",
        pointerEvents: "none",
        height: 10,
        background: "var(--barActiveColor)"
    }
}

interface Props {

    minCurrentPosition: number,
    maxCurrentPosition: number,

    handlerActive: HandlerActive,
    onHandleStatusChange: Function,
    onChangePercent: Function,

    aria: {
        minHandler: string,
        maxHandler: string,
    }
}

export const RangeSlider = (props: Props): JSX.Element => {
    const rangeWrapperRef = React.useRef(null)
    const minHandlerRef = React.useRef(null)
    const maxHandlerRef = React.useRef(null)

    const handleMouseMove = (e: MouseEvent) => {
        if (!rangeWrapperRef.current) {
            return
        }

        const percentPosition = getPercentFromPosition(rangeWrapperRef, e.clientX)

        return props.onChangePercent(percentPosition, props.handlerActive === "min")
    }

    const handleHandlerInactive = () => {
        props.onHandleStatusChange()

        if (minHandlerRef.current) {
            (minHandlerRef.current as HTMLButtonElement).blur()
        }
        if (maxHandlerRef.current) {
            (maxHandlerRef.current as HTMLButtonElement).blur()
        }
    }

    const handleBarClick = (e: React.MouseEvent) => {
        if (!minHandlerRef.current || !maxHandlerRef.current || !rangeWrapperRef.current) {
            return
        }

        const minHandlePosition = (minHandlerRef.current as HTMLDivElement).getBoundingClientRect().left
        const maxHandlePosition = (maxHandlerRef.current as HTMLDivElement).getBoundingClientRect().left
        const currentPosition = e.clientX

        const closestMinHandler = Math.abs(currentPosition - minHandlePosition) < Math.abs(currentPosition - maxHandlePosition)

        const percentPosition = getPercentFromPosition(rangeWrapperRef, currentPosition)

        return props.onChangePercent(percentPosition, closestMinHandler)
    }

    React.useEffect(() => {
        const cleanup = () => {
            document.body.removeEventListener('mouseup', handleHandlerInactive)
            document.body.removeEventListener('mouseleave', handleHandlerInactive)
            document.body.removeEventListener('mousemove', handleMouseMove)
        }

        if (props.handlerActive !== null) {

            if (minHandlerRef.current && maxHandlerRef.current) {
                if (props.handlerActive === "min") {
                    (minHandlerRef.current as HTMLButtonElement).focus()
                } else {
                    (maxHandlerRef.current as HTMLButtonElement).focus()
                }
            }

            document.body.addEventListener('mouseup', handleHandlerInactive)
            document.body.addEventListener('mouseleave', handleHandlerInactive)
            document.body.addEventListener('mousemove', handleMouseMove)
        }

        return cleanup

    }, [props.handlerActive])

    return (

        <div
            ref={rangeWrapperRef}
            style={{
                ...styles.wrapper
            }}
        >

            <div
                title={"Range space"}
                style={styles.backgroundBar}
                onClick={handleBarClick}
            />

            <div style={{
                ...styles.selectedBar,
                ...{
                    "left": `${props.minCurrentPosition}%`,
                    "right": `calc(100% - ${props.maxCurrentPosition}%)`
                } as React.CSSProperties
            }
            }/>

            <Handler
                aria={{label: "Min Handler"}}
                currentPosition={props.minCurrentPosition}
                currentActive={props.handlerActive === "min"}
                onActive={() => props.onHandleStatusChange("min")}
                onInactive={() => props.onHandleStatusChange(null)}
                handlerRef={minHandlerRef}
            />

            <Handler
                aria={{label: "Max Handler"}}
                currentPosition={props.maxCurrentPosition}
                currentActive={props.handlerActive === "max"}
                onActive={() => props.onHandleStatusChange("max")}
                onInactive={() => props.onHandleStatusChange(null)}
                handlerRef={maxHandlerRef}
            />

        </div>
    )
}

const getPercentFromPosition = (rangeWrapperRef: React.MutableRefObject<any>, mousePosition: number) => {
    const rangeWrapper = (rangeWrapperRef.current as HTMLDivElement)
    const minPosition = rangeWrapper.offsetLeft
    const maxPosition = minPosition + rangeWrapper.offsetWidth

    return calculatePercentFromPosition(mousePosition, minPosition, maxPosition)
}
