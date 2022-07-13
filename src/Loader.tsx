import * as React from 'react'
import {getConfig} from "./common/ws"
import {Loading} from "./common/Loading"
import {useParams} from "react-router-dom"
import Range from "./components/Range/Range"

interface Props {
    type: string
}

const Loader = (props: Props) => {
    const [data, setData] = React.useState({})
    const [loaded, setLoaded] = React.useState(false)
    const params = useParams()

    React.useEffect(() => {
        const type = props.type.startsWith("param:") ? params[props.type.replace(/param:/, "")] ?? "" : props.type

        getConfig(type)
            .then((jsonData) => {
                if (jsonData) {
                    setData(jsonData)
                    setLoaded(true)
                }
            })
    }, [])

    if (!loaded) {
        return (
            <Loading/>
        )
    }

    return (
        <Range initialData={data}/>
    )
}

export default Loader
