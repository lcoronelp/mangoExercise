import React from 'react'
import {cleanup, render, screen} from '@testing-library/react'

import Range from '../Range'
import {basicErrorEmptyTestData, basicErrorTextTestData} from './utils/exampleData'

describe('Data with error Tests', () => {

    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {
        })
    })

    afterAll(() => {
        console.error.mockRestore()
    })

    afterEach(() => {
        console.error.mockClear()
    })

    afterEach(() => {
        cleanup()
    })

    test('Empty data', () => {
        render(<Range initialData={basicErrorEmptyTestData}/>)
        expect(screen.queryByTitle('Range Selector')).toBeNull()
        expect(console.error).toHaveBeenCalled()
        expect(console.error.mock.calls[0][0]).toContain('The webservice don\'t return the minimum data to work')
    })

    test('Error data (text instead number)', () => {
        render(<Range initialData={basicErrorTextTestData}/>)
        expect(screen.queryByTitle('Range Selector')).toBeNull()
        expect(console.error).toHaveBeenCalled()
        expect(console.error.mock.calls[0][0]).toContain('Some of the items in \'rangeItems\' returned by the webservice are not numbers')

    })
})
