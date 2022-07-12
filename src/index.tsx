import * as React from 'react'
import * as ReactDOM from "react-dom"

import {createRoutesFromChildren, matchRoutes, useLocation, useNavigationType} from "react-router-dom"

import {createBrowserHistory} from 'history'

import * as Sentry from "@sentry/react"
import {BrowserTracing} from "@sentry/tracing"

import "./scss/base.scss"
import App from './App'

let mountNode = document.getElementById("app")

const history = createBrowserHistory()

Sentry.init({
    environment: process.env.ENVIRONMENT,
    dsn: process.env.SENTRY_DSN,
    integrations: [
        new BrowserTracing({
            tracingOrigins: ["localhost", "leocoronel.com", /^\//],
            routingInstrumentation: Sentry.reactRouterV6Instrumentation(
                React.useEffect,
                useLocation,
                useNavigationType,
                createRoutesFromChildren,
                matchRoutes
            )
        })
    ],
    tracesSampleRate: +(process.env.SENTRY_SAMPLE_RATE ?? "1")
})

ReactDOM.render(<App/>, mountNode)
