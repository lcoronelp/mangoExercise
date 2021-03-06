import React from 'react'
import {cleanup, render, screen} from '@testing-library/react'

import Range from '../Range'
import {multipleTestData} from './utils/exampleData'

describe('Explicit type basic Tests ([1.99, 5.99, 10.99, 30.99, 50.99, 70.99])', () => {

    beforeEach(() => {
        render(<Range initialData={multipleTestData}/>)
    })

    afterEach(() => {
        cleanup()
    })

    test('Basic render', () => {
        const minInputExpect = expect(screen.queryByTitle('Min Value'))
        minInputExpect.toBeInTheDocument()
        minInputExpect.toHaveTextContent('1.99')

        const maxInputExpect = expect(screen.queryByTitle('Max Value'))
        maxInputExpect.toBeInTheDocument()
        maxInputExpect.toHaveTextContent('70.99')

        const minHandlerExpect = expect(screen.getByRole('button', {name: 'Min Handler'}))
        minHandlerExpect.toBeInTheDocument()
        minHandlerExpect.toHaveStyle('left: 0%')

        const maxHandlerExpect = expect(screen.getByRole('button', {name: 'Max Handler'}))
        maxHandlerExpect.toBeInTheDocument()
        maxHandlerExpect.toHaveStyle('left: 100%')
    })
})
