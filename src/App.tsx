import * as React from 'react'
import { hot } from "react-hot-loader/root"
import {Helmet} from "react-helmet"
import {BrowserRouter, Route, Routes} from "react-router-dom"
import * as Sentry from "@sentry/react"

import {Loading} from "./common/Loading"
import {Module} from "./types/Module"

const modulesAvailable: Module[] = [
    {
        path: "exercise1",
        componentName: "rangeSelector",
        configurations: {
            "a": "1"
        }
    },
    {
        path: "exercise2",
        componentName: "rangeSelector"
    }
]

const App = (): JSX.Element => {

    // Construct dynamic modules
    const dynamicModules = modulesAvailable.map((module: Module) => {

        const DynamicComponent: React.LazyExoticComponent<() => JSX.Element> = React.lazy(() => import(`./modules/${module.componentName}/module`))

        return {
            path: module.path,
            component: <DynamicComponent {...(module.configurations ?? {})}/>
        }
    })

    return (
        <>
            <Helmet>
                <meta charSet="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0, user-scalable=yes"/>
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
