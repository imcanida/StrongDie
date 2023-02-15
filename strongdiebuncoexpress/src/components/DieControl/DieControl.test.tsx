import { render, screen, fireEvent } from '@testing-library/react'
import { LoadedDieSetting } from '../../api'
import DieControl from './index'

test('renders a die icon and a weight settings button', () => {
  const dieSettings: LoadedDieSetting = {
    favor: 1,
    factor: 2
  }

  render(<DieControl loadedDieSetting={dieSettings} />)
  const dieIcon = screen.getByRole('img', { name: '1' })
  expect(dieIcon).toBeInTheDocument()

  const weightButton = screen.getByRole('button', { name: 'Weight' })
  expect(weightButton).toBeInTheDocument()
})
