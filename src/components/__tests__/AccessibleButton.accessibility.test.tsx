import { render, screen, fireEvent } from '@testing-library/react'
import { AccessibleButton } from '../ui/AccessibleButton'
import { axe, toHaveNoViolations } from 'jest-axe'
import '@testing-library/jest-dom'

// Properly extend expect with jest-axe matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R
    }
  }
}

expect.extend({ toHaveNoViolations } as any)

describe('AccessibleButton', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(
      <AccessibleButton>Test Button</AccessibleButton>
    )
    
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should have proper ARIA attributes', () => {
    render(
      <AccessibleButton 
        description="Bouton de test"
        aria-label="Test"
      >
        Test Button
      </AccessibleButton>
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Test')
  })

  it('should be keyboard accessible', () => {
    render(<AccessibleButton>Test Button</AccessibleButton>)
    
    const button = screen.getByRole('button')
    
    // Test keyboard navigation
    button.focus()
    expect(button).toEqual(document.activeElement)
    
    // Test Enter key
    fireEvent.keyDown(button, { key: 'Enter' })
  })

  it('should show loading state correctly', () => {
    render(
      <AccessibleButton loading>
        Loading Button
      </AccessibleButton>
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-busy', 'true')
    
    const spinner = button.querySelector('.animate-spin')
    expect(spinner).toBeTruthy()
  })
})
