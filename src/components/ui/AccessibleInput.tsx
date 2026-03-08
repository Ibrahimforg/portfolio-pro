'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
  required?: boolean
  description?: string
}

export const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(
  ({ 
    label, 
    error, 
    helperText, 
    required = false,
    description,
    className,
    id,
    ...props 
  }, ref) => {
    const generatedId = React.useId()
    const inputId = id || `input-${generatedId}`
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`
    const descriptionId = `${inputId}-description`

    return (
      <div className="space-y-2">
        <label 
          htmlFor={inputId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {required && (
            <span className="ml-1 text-destructive" aria-label="Obligatoire">
              *
            </span>
          )}
        </label>
        
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
            'ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={cn(
            error && errorId,
            helperText && helperId,
            description && descriptionId
          )}
          aria-required={required}
          {...props}
        />
        
        {error && (
          <div id={errorId} className="text-sm text-destructive" role="alert">
            {error}
          </div>
        )}
        
        {helperText && !error && (
          <div id={helperId} className="text-sm text-muted-foreground">
            {helperText}
          </div>
        )}
        
        {description && (
          <div id={descriptionId} className="sr-only">
            {description}
          </div>
        )}
      </div>
    )
  }
)

AccessibleInput.displayName = 'AccessibleInput'
