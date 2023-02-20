import { render, screen } from '@testing-library/react'
import { DieControl } from './index'

describe('DieControl', () => {
  const loadedDieSetting = {
    favor: 1,
    factor: 2,
    index: 0,
  }

  beforeEach(() => {
    jest.useFakeTimers();
  })

  afterEach(() => {
    jest.useRealTimers();
  })

  it('should render with default props', () => {
    render(<DieControl loadedDieSetting={loadedDieSetting} />);
    expect(screen.getByTestId('die-control')).toBeInTheDocument();
  })

});