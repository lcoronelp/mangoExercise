import * as React from 'react'
import {hot} from "react-hot-loader/root"
import {Helmet} from "react-helmet"
import {BrowserRouter, Route, Routes} from "react-router-dom"
import * as Sentry from "@sentry/react"

import {Loading} from "./common/Loading"
import {Module} from "./types/Module"

const componentsAvailable: Module[] = [
    {
        path: "exercise1",
        componentName: "Range",
        configurations: {
            "type": process.env.EXERCISE1_MOCK_TYPE
        }
    },
    {
        path: "exercise2",
        componentName: "Range",
        configurations: {
            "type": process.env.EXERCISE2_MOCK_TYPE
        }
    }
]

const App = (): JSX.Element => {

    // Construct dynamic components
    const dynamicModules = componentsAvailable.map((component: Module) => {

        const DynamicComponent: React.LazyExoticComponent<() => JSX.Element> = React.lazy(() => import(`./components/${component.componentName}/${component.componentName}`))

        return {
            path: component.path,
            component: <DynamicComponent {...(component.configurations ?? {})}/>
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
