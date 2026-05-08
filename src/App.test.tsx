import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

describe('App', () => {
  it('renders scaffold heading', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByText('Marathi Flashcards')).toBeTruthy()
    expect(screen.getAllByText('Decks').length).toBeGreaterThan(0)
  })
})
