import * as React from 'react'
import {hot} from "react-hot-loader/root"
import {Helmet} from "react-helmet"
import {BrowserRouter, Route, Routes} from "react-router-dom"
import * as Sentry from "@sentry/react"

import {Loading} from "./common/Loading"
import {RouteAvailable} from "./types/RouteAvailable"

const routesAvailable: RouteAvailable[] = [
    {
        path: "exercise1",
        componentName: "Loader",
        configurations: {
            "type": process.env.EXERCISE1_MOCK_TYPE ?? ""
        }
    },
    {
        path: "exercise2",
        componentName: "Loader",
        configurations: {
            "type": process.env.EXERCISE2_MOCK_TYPE ?? ""
        }
    },
    {
        path: "exerciseGeneric/:type",
        componentName: "Loader",
        configurations: {
            "type": "param:type"
        }
    }
]

const App = (): JSX.Element => {

    // Construct dynamic components
    const dynamicModules = routesAvailable.map((component: RouteAvailable) => {

        const DynamicComponent: React.LazyExoticComponent<() => JSX.Element> = React.lazy(() => import(`./${component.componentName}`))
        return {
            path: component.path,
            component: <DynamicComponent {...component.configurations}/>
        }
    })

    return (
        <>
            <Helmet>
                <meta charSet="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0, user-scalable=yes"/>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={"true"}/>
                <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap" rel="stylesheet" crossOrigin="anonymous"/>
            </Helmet>
            <Sentry.ErrorBoundary fallback={<></>}>
                <BrowserRouter>
                    <Routes>
                        {dynamicModules.map((dynamicModule) => (
                            <Route key={`${dynamicModule.path}`} path={`${dynamicModule.path}`} element={
                                <React.Suspense fallback={<Loading/>}>
                                    {dynamicModule.component}
                                </React.Suspense>
                            }/>
                        ))}
                    </Routes>
                </BrowserRouter>
            </Sentry.ErrorBoundary>
        </>
    )
}

export default hot(App)
