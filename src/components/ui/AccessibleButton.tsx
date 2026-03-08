'use client'

import React, { forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  description?: string
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ 
    children, 
    className, 
    variant = 'primary', 
    size = 'md',
    loading = false,
    icon,
    description,
    disabled,
    onClick,
    ...props 
  }, ref) => {
    const generatedId = useId()
    const buttonId = props.id || `button-${generatedId}`

    return (
      <button
        ref={ref}
        id={buttonId}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-2 focus-visible:outline-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
            'border border-input bg-background hover:bg-accent hover:text-accent-foreground': variant === 'outline',
            'h-9 px-3 text-sm': size === 'sm',
            'h-10 py-2 px-4 text-sm': size === 'md',
            'h-11 px-8 text-base': size === 'lg',
          },
          className
        )}
        disabled={disabled || loading}
        aria-describedby={description ? `${buttonId}-desc` : undefined}
        aria-busy={loading}
        onClick={onClick}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {icon && <span className="mr-2">{icon}</span>}
        {children}
        {description && (
          <span id={`${buttonId}-desc`} className="sr-only">
            {description}
          </span>
        )}
      </button>
    )
  }
)

AccessibleButton.displayName = 'AccessibleButton'
