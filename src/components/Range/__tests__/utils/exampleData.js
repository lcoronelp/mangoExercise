export const basicTestData = {
    'locale': 'en',
    'decimalPositions': 2,
    'currency': '€',
    'currencyOnLeft': false,
    'type': 'simple',
    'editable': true,
    'rangeItems': [
        60,
        1500,
    ],
    'minCurrentValue': 60,
    'maxCurrentValue': 1500,
    'minCurrentPosition': 0,
    'maxCurrentPosition': 100,
    'rangeItemsPositions': [
        0,
        100,
    ],
}

export const multipleTestData = {
    'locale': 'en',
    'decimalPositions': 2,
    'currency': '€',
    'currencyOnLeft': false,
    'type': 'multiple',
    'editable': false,
    'rangeItems': [1.99, 5.99, 10.99, 30.99, 50.99, 70.99],
    'minCurrentValue': 1.99,
    'maxCurrentValue': 70.99,
    'minCurrentPosition': 0,
    'maxCurrentPosition': 100,
    'rangeItemsPositions': [
        0,
        5.797101449275362,
        13.043478260869565,
        42.028985507246375,
        71.01449275362319,
        100,
    ],
}
