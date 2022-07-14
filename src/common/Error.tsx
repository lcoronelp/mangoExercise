import * as React from "react"

const styles: { [key: string]: React.CSSProperties } = {
    div: {
        display: "grid",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        placeItems: "center",
        color: "#cc0000",
        fontWeight: "bold"
    }
}

export const Error = ({children}: { children: any }) => {
    return (
        <div style={styles.div}>
            {children}
        </div>
    )
}
