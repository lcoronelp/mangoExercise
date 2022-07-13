import React from 'react'
import {cleanup, fireEvent, render, screen} from '@testing-library/react'
import {basicTestData} from './utils/exampleData'

import Range from '../Range'
import userEvent from '@testing-library/user-event'

describe('Implicit type rangeSelector actions Tests (min 60, max 1500)', () => {
    let leftValue

    beforeEach(() => {
        function* leftGenerator() {
            let index = 0
            const values = [0, 100]
            while (index < 2) {
                const value = values[index] ?? 0
                index++
                yield value
            }
        }

        leftValue = leftGenerator()

        Element.prototype.getBoundingClientRect = jest.fn(() => {
            return {
                width: 0,
                height: 0,
                top: 0,
                left: leftValue.next().value,
                bottom: 0,
                right: 0,
            }
        })

        Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
            configurable: true,
            value: 0,
        })
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
            configurable: true,
            value: 100,
        })
        render(<Range initialData={basicTestData}/>)
    })

    afterEach(() => {
        cleanup()
    })

    test('When user drag min handle to right 20px, then the min handle and min value change', async () => {
        const minInput = screen.getByRole('textbox', {name: `Min Value`})
        const minHandler = screen.getByRole('button', {name: 'Min Handler'})

        const current = {
            clientX: 0,
            clientY: 0,
        }

        fireEvent.mouseEnter(minHandler, current)
        fireEvent.mouseOver(minHandler, current)
        fireEvent.mouseMove(minHandler, current)
        fireEvent.mouseDown(minHandler, current)
        // This movement is false (because we are in jsdom test environment) but by this test can be enough
        current.clientX += 20
        fireEvent.mouseMove(minHandler, current)
        fireEvent.mouseUp(minHandler, current)

        expect(minHandler).toHaveStyle('left: 20%;')
        expect(minInput).toHaveValue('348')
    })

    test('When user drag min handle to left 20px, then the min handle and min value not change', async () => {
        const minInput = screen.getByRole('textbox', {name: `Min Value`})
        const minHandler = screen.getByRole('button', {name: 'Min Handler'})

        const current = {
            clientX: 0,
            clientY: 0,
        }

        fireEvent.mouseEnter(minHandler, current)
        fireEvent.mouseOver(minHandler, current)
        fireEvent.mouseMove(minHandler, current)
        fireEvent.mouseDown(minHandler, current)
        // This movement is false (because we are in jsdom test environment) but by this test can be enough
        current.clientX += -1
        fireEvent.mouseMove(minHandler, current)
        fireEvent.mouseUp(minHandler, current)

        expect(minHandler).toHaveStyle('left: 0%;')
        expect(minInput).toHaveValue('60')
    })

    test('When user drag max handle to left 20px, then the max handle and max value change', async () => {
        const maxInput = screen.getByRole('textbox', {name: `Max Value`})
        const maxHandler = screen.getByRole('button', {name: 'Max Handler'})

        const current = {
            clientX: 100,
            clientY: 0,
        }

        fireEvent.mouseEnter(maxHandler, current)
        fireEvent.mouseOver(maxHandler, current)
        fireEvent.mouseMove(maxHandler, current)
        fireEvent.mouseDown(maxHandler, current)
        // This movement is false (because we are in jsdom test environment) but by this test can be enough
        current.clientX += -20
        fireEvent.mouseMove(maxHandler, current)
        fireEvent.mouseUp(maxHandler, current)

        expect(maxHandler).toHaveStyle('left: 80%;')
        expect(maxInput).toHaveValue('1212')
    })

    test('When user drag max handle to right 20px, then the max handle and max value not change', async () => {
        const maxInput = screen.getByRole('textbox', {name: `Max Value`})
        const maxHandler = screen.getByRole('button', {name: 'Max Handler'})

        const current = {
            clientX: 100,
            clientY: 0,
        }

        fireEvent.mouseEnter(maxHandler, current)
        fireEvent.mouseOver(maxHandler, current)
        fireEvent.mouseMove(maxHandler, current)
        fireEvent.mouseDown(maxHandler, current)
        // This movement is false (because we are in jsdom test environment) but by this test can be enough
        current.clientX += 20
        fireEvent.mouseMove(maxHandler, current)
        fireEvent.mouseUp(maxHandler, current)

        expect(maxHandler).toHaveStyle('left: 100%;')
        expect(maxInput).toHaveValue('1500')
    })

    test('When user drag min handle to right 60px, and after drag max handle to left 60px, then the min handle and min value change to small values and max handle and max value change to max values', async () => {
        const minInput = screen.getByRole('textbox', {name: `Min Value`})
        const minHandler = screen.getByRole('button', {name: 'Min Handler'})

        const minCurrent = {
            clientX: 0,
            clientY: 0,
        }

        fireEvent.mouseEnter(minHandler, minCurrent)
        fireEvent.mouseOver(minHandler, minCurrent)
        fireEvent.mouseMove(minHandler, minCurrent)
        fireEvent.mouseDown(minHandler, minCurrent)
        // This movement is false (because we are in jsdom test environment) but by this test can be enough
        minCurrent.clientX += 60
        fireEvent.mouseMove(minHandler, minCurrent)
        fireEvent.mouseUp(minHandler, minCurrent)

        expect(minHandler).toHaveStyle('left: 60%;')
        expect(minInput).toHaveValue('924')

        const maxInput = screen.getByRole('textbox', {name: `Max Value`})
        const maxHandler = screen.getByRole('button', {name: 'Max Handler'})

        const maxCurrent = {
            clientX: 100,
            clientY: 0,
        }

        fireEvent.mouseEnter(maxHandler, maxCurrent)
        fireEvent.mouseOver(maxHandler, maxCurrent)
        fireEvent.mouseMove(maxHandler, maxCurrent)
        fireEvent.mouseDown(maxHandler, maxCurrent)
        // This movement is false (because we are in jsdom test environment) but by this test can be enough
        maxCurrent.clientX += -60
        fireEvent.mouseMove(maxHandler, maxCurrent)
        fireEvent.mouseUp(maxHandler, maxCurrent)

        expect(minHandler).toHaveStyle('left: 40%;')
        expect(minInput).toHaveValue('636')

        expect(maxHandler).toHaveStyle('left: 60%;')
        expect(maxInput).toHaveValue('924')
    })

    test('When user drag max handle to left 60px, and after drag min handle to right 60px, then the min handle and min value change to small values and max handle and max value change to max values', async () => {
        const maxInput = screen.getByRole('textbox', {name: `Max Value`})
        const maxHandler = screen.getByRole('button', {name: 'Max Handler'})

        const maxCurrent = {
            clientX: 100,
            clientY: 0,
        }

        fireEvent.mouseEnter(maxHandler, maxCurrent)
        fireEvent.mouseOver(maxHandler, maxCurrent)
        fireEvent.mouseMove(maxHandler, maxCurrent)
        fireEvent.mouseDown(maxHandler, maxCurrent)
        // This movement is false (because we are in jsdom test environment) but by this test can be enough
        maxCurrent.clientX += -60
        fireEvent.mouseMove(maxHandler, maxCurrent)
        fireEvent.mouseUp(maxHandler, maxCurrent)

        expect(maxHandler).toHaveStyle('left: 40%;')
        expect(maxInput).toHaveValue('636')

        const minInput = screen.getByRole('textbox', {name: `Min Value`})
        const minHandler = screen.getByRole('button', {name: 'Min Handler'})

        const minCurrent = {
            clientX: 0,
            clientY: 0,
        }

        fireEvent.mouseEnter(minHandler, minCurrent)
        fireEvent.mouseOver(minHandler, minCurrent)
        fireEvent.mouseMove(minHandler, minCurrent)
        fireEvent.mouseDown(minHandler, minCurrent)
        // This movement is false (because we are in jsdom test environment) but by this test can be enough
        minCurrent.clientX += 60
        fireEvent.mouseMove(minHandler, minCurrent)
        fireEvent.mouseUp(minHandler, minCurrent)

        expect(minHandler).toHaveStyle('left: 40%;')
        expect(minInput).toHaveValue('636')

        expect(maxHandler).toHaveStyle('left: 60%;')
        expect(maxInput).toHaveValue('924')
    })

    test('When user click on the center of range, then the max handle and max value change to middle', async () => {
        const minInput = screen.getByRole('textbox', {name: `Min Value`})
        const minHandler = screen.getByRole('button', {name: 'Min Handler'})

        const maxInput = screen.getByRole('textbox', {name: `Max Value`})
        const maxHandler = screen.getByRole('button', {name: 'Max Handler'})

        const range = screen.getByTitle('Range space')

        await userEvent.pointer([{target: range}, {keys: '[MouseLeft]', target: range, coords: {clientX: 50}}])

        expect(minHandler).toHaveStyle('left: 0%;')
        expect(minInput).toHaveValue('60')
        expect(maxHandler).toHaveStyle('left: 50%;')
        expect(maxInput).toHaveValue('780')

    })

    test('When user click on the left space of range, then the min handle and min value change to middle', async () => {
        const minInput = screen.getByRole('textbox', {name: `Min Value`})
        const minHandler = screen.getByRole('button', {name: 'Min Handler'})

        const maxInput = screen.getByRole('textbox', {name: `Max Value`})
        const maxHandler = screen.getByRole('button', {name: 'Max Handler'})

        const range = screen.getByTitle('Range space')

        await userEvent.pointer([{target: range}, {keys: '[MouseLeft]', target: range, coords: {clientX: 30}}])

        expect(minHandler).toHaveStyle('left: 30%;')
        expect(minInput).toHaveValue('492')
        expect(maxHandler).toHaveStyle('left: 100%;')
        expect(maxInput).toHaveValue('1500')

    })

    test('When user click on the right space of range, then the max handle and max value change to middle', async () => {
        const minInput = screen.getByRole('textbox', {name: `Min Value`})
        const minHandler = screen.getByRole('button', {name: 'Min Handler'})

        const maxInput = screen.getByRole('textbox', {name: `Max Value`})
        const maxHandler = screen.getByRole('button', {name: 'Max Handler'})

        const range = screen.getByTitle('Range space')

        await userEvent.pointer([{target: range}, {keys: '[MouseLeft]', target: range, coords: {clientX: 70}}])

        expect(minHandler).toHaveStyle('left: 0%;')
        expect(minInput).toHaveValue('60')
        expect(maxHandler).toHaveStyle('left: 70%;')
        expect(maxInput).toHaveValue('1068')

    })
})
