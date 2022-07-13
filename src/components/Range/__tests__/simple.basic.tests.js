import React from 'react'
import {cleanup, render, screen} from '@testing-library/react'

import Range from '../Range'
import {basicTestData} from './utils/exampleData'

describe('Implicit type basic Tests (min 60, max 1500)', () => {

    beforeEach(() => {
        render(<Range initialData={basicTestData}/>)
    })

    afterEach(() => {
        cleanup()
    })

    test('Basic render', () => {
        const minInputExpect = expect(screen.getByRole('textbox', {name: 'Min Value'}))
        minInputExpect.toBeInTheDocument()
        minInputExpect.not.toHaveAttribute('readonly')
        minInputExpect.toHaveValue('60')

        const maxInputExpect = expect(screen.getByRole('textbox', {name: 'Max Value'}))
        maxInputExpect.toBeInTheDocument()
        maxInputExpect.not.toHaveAttribute('readonly')
        maxInputExpect.toHaveValue('1500')

        const minHandlerExpect = expect(screen.getByRole('button', {name: 'Min Handler'}))
        minHandlerExpect.toBeInTheDocument()
        minHandlerExpect.toHaveStyle('left: 0%')

        const maxHandlerExpect = expect(screen.getByRole('button', {name: 'Max Handler'}))
        maxHandlerExpect.toBeInTheDocument()
        maxHandlerExpect.toHaveStyle('left: 100%')
    })
})
