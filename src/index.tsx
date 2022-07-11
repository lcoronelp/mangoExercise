import * as React from 'react'
import * as ReactDOM from "react-dom"

import * as Sentry from "@sentry/react"
import {BrowserTracing} from "@sentry/tracing"

import App from './App'

let mountNode = document.getElementById("app")

Sentry.init({
    environment: process.env.ENVIRONMENT,
    dsn: process.env.SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: +(process.env.SENTRY_SAMPLE_RATE ?? "1")
})

ReactDOM.render(<App/>, mountNode)
