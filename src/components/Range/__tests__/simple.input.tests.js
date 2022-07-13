import React from 'react'
import {cleanup, render, screen, waitFor} from '@testing-library/react'
import {basicTestData} from './utils/exampleData'

import Range from '../Range'
import {defineInputAs} from './utils/utils'


describe('Implicit type input change Tests (min 60, max 1500)', () => {
    beforeEach(() => {
        render(<Range initialData={basicTestData}/>)
    })

    afterEach(() => {
        cleanup()
    })

    test('When user change min value to 100, then, after debounce, the min input will be update to 100 and min handle move to percent position of 2.7^%', async () => {
        const minInput = await defineInputAs(screen,'Min', 100)
        const minHandler = screen.getByRole('button', {name: 'Min Handler'})
        expect(minHandler).toHaveStyle('left: 0%;')
        await waitFor(() => {
            expect(minHandler).toHaveStyle('left: 2.7777777777777777%;')
            expect(minInput).toHaveValue('100')
        }, {timeout: 500})
    })

    test('When user change min value to [empty], then, after debounce, the min input will be return to 60 and min handle keep on 0%', async () => {
        const minInput = await defineInputAs(screen,'Min', "")
        const minHandler = screen.getByRole('button', {name: 'Min Handler'})
        expect(minHandler).toHaveStyle('left: 0%;')
        await waitFor(() => {
            expect(minHandler).toHaveStyle('left: 0%;')
            expect(minInput).toHaveValue('60')
        }, {timeout: 500})
    })

    test('When user change min value to 0, then, after debounce, the min input will be return to 60 and min handle keep on 0%', async () => {
        const minInput = await defineInputAs(screen,'Min', 0)
        const minHandler = screen.getByRole('button', {name: 'Min Handler'})
        await waitFor(() => {
            expect(minHandler).toHaveStyle('left: 0%;')
            expect(minInput).toHaveValue('60')
        }, {timeout: 500})
    })

    test('When user change min value to 5000, then, after debounce, the min input will be return to 60 and min handle keep on 0%', async () => {
        const minInput = await defineInputAs(screen,'Min', 5000)
        const minHandler = screen.getByRole('button', {name: 'Min Handler'})
        await waitFor(() => {
            expect(minHandler).toHaveStyle('left: 0%;')
            expect(minInput).toHaveValue('60')
        }, {timeout: 500})
    })

    test('When user change max value to 100, then after debounce, the max input will be update to 100 and max handle move to percent position of 2.7^%', async () => {
        const maxInput = await defineInputAs(screen,'Max', 100)
        const maxHandler = screen.getByRole('button', {name: 'Max Handler'})
        expect(maxHandler).toHaveStyle('left: 100%;')
        await waitFor(() => {
            expect(maxHandler).toHaveStyle('left: 2.7777777777777777%;')
            expect(maxInput).toHaveValue('100')
        }, {timeout: 500})
    })

    test('When user change max value to 5000, then, after debounce, the max input will be return to 1500 and max handle keep on 100%', async () => {
        const maxInput = await defineInputAs(screen,'Max', 5000)
        const maxHandler = screen.getByRole('button', {name: 'Max Handler'})
        await waitFor(() => {
            expect(maxHandler).toHaveStyle('left: 100%;')
            expect(maxInput).toHaveValue('1500')
        }, {timeout: 500})
    })

    test('When user change max value to [empty], then, after debounce, the max input will be return to 1500 and max handle keep on 100%', async () => {
        const maxInput = await defineInputAs(screen,'Max', "")
        const maxHandler = screen.getByRole('button', {name: 'Max Handler'})
        expect(maxHandler).toHaveStyle('left: 100%;')
        await waitFor(() => {
            expect(maxHandler).toHaveStyle('left: 100%;')
            expect(maxInput).toHaveValue('1500')
        }, {timeout: 500})
    })

    test('When user change max value to -5000, then, after debounce, the max input will be return to 1500 and max handle keep on 100%', async () => {
        const maxInput = await defineInputAs(screen,'Max', -5000)
        const maxHandler = screen.getByRole('button', {name: 'Max Handler'})
        await waitFor(() => {
            expect(maxHandler).toHaveStyle('left: 100%;')
            expect(maxInput).toHaveValue('1500')
        }, {timeout: 500})
    })

    test('When user change min value to 600 and after change max value to 600, then, after debounce, the min/max input will be update to 600 and min/max handle move to percent position of 37.5%', async () => {
        const minInput = await defineInputAs(screen,'Min', 600)
        const minHandler = screen.getByRole('button', {name: 'Min Handler'})
        await waitFor(() => {
            expect(minHandler).toHaveStyle('left: 37.5%;')
            expect(minInput).toHaveValue('600')
        }, {timeout: 500})

        const maxInput = await defineInputAs(screen,'Max', 600)
        const maxHandler = screen.getByRole('button', {name: 'Max Handler'})
        await waitFor(() => {
            expect(maxHandler).toHaveStyle('left: 37.5%;')
            expect(maxInput).toHaveValue('600')
        }, {timeout: 500})
    })

    test('When user change min value to 600 and after change max value to 500, then, after debounce, the min input will be update to 600 and min handle move to percent position of 37.5% but the max input will be return to 1500 and max handle keep on 100%', async () => {
        const minInput = await defineInputAs(screen,'Min', 600)
        const minHandler = screen.getByRole('button', {name: 'Min Handler'})
        await waitFor(() => {
            expect(minHandler).toHaveStyle('left: 37.5%;')
            expect(minInput).toHaveValue('600')
        }, {timeout: 500})

        const maxInput = await defineInputAs(screen,'Max', 500)
        const maxHandler = screen.getByRole('button', {name: 'Max Handler'})
        await waitFor(() => {
            expect(maxHandler).toHaveStyle('left: 100%;')
            expect(maxInput).toHaveValue('1500')
        }, {timeout: 500})
    })

    test('When user change max value to 600 and after change min value to 700, then, after debounce, the max input will be update to 600 and max handle move to percent position of 37.5% but the min input will be return to 60 and min handle keep on 0%', async () => {
        const maxInput = await defineInputAs(screen,'Max', 600)
        const maxHandler = screen.getByRole('button', {name: 'Max Handler'})
        await waitFor(() => {
            expect(maxHandler).toHaveStyle('left: 37.5%;')
            expect(maxInput).toHaveValue('600')
        }, {timeout: 500})

        const minInput = await defineInputAs(screen,'Min', 700)
        const minHandler = screen.getByRole('button', {name: 'Min Handler'})
        await waitFor(() => {
            expect(minHandler).toHaveStyle('left: 0%;')
            expect(minInput).toHaveValue('60')
        }, {timeout: 500})
    })
})
