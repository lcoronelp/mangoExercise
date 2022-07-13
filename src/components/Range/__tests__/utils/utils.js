import userEvent from '@testing-library/user-event'

export const defineInputAs = async (screen, type, newValue) => {
    const input = screen.getByRole('textbox', {name: `${type} Value`})
    await userEvent.click(input)
    await userEvent.keyboard(`[Backspace][Backspace][Backspace][Backspace]${newValue}`)
    return input
}

export const sleep = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms)
  })
