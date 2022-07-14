import React from 'react'
import {cleanup, fireEvent, render, screen} from '@testing-library/react'
import {multipleTestData} from './utils/exampleData'

import Range from '../Range'
import userEvent from '@testing-library/user-event'

describe('Explicit type rangeSelector actions Tests ([1.99, 5.99, 10.99, 30.99, 50.99, 70.99])', () => {
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
        render(<Range initialData={multipleTestData}/>)
    })

    afterEach(() => {
        cleanup()
    })

    test('When user drag min handle to right 20px, then the min handle and min value change to closest position', async () => {
        const minInput = screen.queryByTitle('Min Value')
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

        expect(minHandler).toHaveStyle('left: 13.043478260869565%;')
        expect(minInput).toHaveValue('10.99')
    })

    test('When user drag max handle to left 20px, then the max handle and max value change to closest position', async () => {
        const maxInput = screen.queryByTitle('Max Value')
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

        expect(maxHandler).toHaveStyle('left: 71.01449275362319%;')
        expect(maxInput).toHaveValue('50.99')
    })


    test('When user click on the center of range, then the max handle and max value change to closest position', async () => {
        const minInput = screen.queryByTitle('Min Value')
        const minHandler = screen.getByRole('button', {name: 'Min Handler'})

        const maxInput = screen.queryByTitle('Max Value')
        const maxHandler = screen.getByRole('button', {name: 'Max Handler'})

        const range = screen.getByTitle('Range space')

        await userEvent.pointer([{target: range}, {keys: '[MouseLeft]', target: range, coords: {clientX: 50}}])

        expect(minHandler).toHaveStyle('left: 0%;')
        expect(minInput).toHaveValue('1.99')
        expect(maxHandler).toHaveStyle('left: 42.028985507246375%;')
        expect(maxInput).toHaveValue('30.99')

    })

    test('When user click on the left space of range, then the min handle and min value change to closest position', async () => {
        const minInput = screen.queryByTitle('Min Value')
        const minHandler = screen.getByRole('button', {name: 'Min Handler'})

        const maxInput = screen.queryByTitle('Max Value')
        const maxHandler = screen.getByRole('button', {name: 'Max Handler'})

        const range = screen.getByTitle('Range space')

        await userEvent.pointer([{target: range}, {keys: '[MouseLeft]', target: range, coords: {clientX: 30}}])

        expect(minHandler).toHaveStyle('left: 42.028985507246375%;')
        expect(minInput).toHaveValue('30.99')
        expect(maxHandler).toHaveStyle('left: 100%;')
        expect(maxInput).toHaveValue('70.99')

    })

    test('When user click on the right space of range, then the min handle and min value change to closest position', async () => {
        const minInput = screen.queryByTitle('Min Value')
        const minHandler = screen.getByRole('button', {name: 'Min Handler'})

        const maxInput = screen.queryByTitle('Max Value')
        const maxHandler = screen.getByRole('button', {name: 'Max Handler'})

        const range = screen.getByTitle('Range space')

        await userEvent.pointer([{target: range}, {keys: '[MouseLeft]', target: range, coords: {clientX: 70}}])

        expect(minHandler).toHaveStyle('left: 0%;')
        expect(minInput).toHaveValue('1.99')
        expect(maxHandler).toHaveStyle('left: 71.01449275362319%;')
        expect(maxInput).toHaveValue('50.99')

    })
})
