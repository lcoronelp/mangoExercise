import * as React from "react"

const loadingStyles: { [key: string]: React.CSSProperties } = {
    loadingDiv: {
        display: "grid",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        placeItems: "center"
    }
}

export const Loading = () => <div style={loadingStyles.loadingDiv}/>
