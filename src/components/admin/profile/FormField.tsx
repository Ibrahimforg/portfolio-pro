// Composant de champ de formulaire réutilisable
// Design industriel avec validation intégrée

'use client'

import React, { forwardRef, useState } from 'react'
import { FormFieldProps } from '@/types/profile'

export const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
  ({ 
    label, 
    value, 
    onChange, 
    placeholder, 
    type = 'text', 
    required = false, 
    disabled = false, 
    icon, 
    helper, 
    error 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false)

    const baseClasses = `
      w-full px-4 py-3 rounded-lg border transition-all duration-200
      bg-surface text-text-primary placeholder-text-secondary
      focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
      disabled:bg-surface-disabled disabled:cursor-not-allowed disabled:text-text-disabled
      ${icon ? 'pl-12' : ''}
      ${error ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-700'}
      ${isFocused ? 'border-primary shadow-sm' : ''}
    `

    const labelClasses = `
      block text-sm font-medium text-text-primary mb-2
      ${required ? 'after:content-["*"] after:ml-1 after:text-red-500' : ''}
    `

    const renderInput = () => {
      const commonProps = {
        ref,
        value,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
        placeholder,
        disabled,
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
        className: baseClasses
      }

      if (type === 'textarea') {
        return (
          <textarea
            {...commonProps}
            ref={ref as React.RefObject<HTMLTextAreaElement>}
            rows={4}
          />
        )
      }

      return (
        <input
          {...commonProps}
          ref={ref as React.RefObject<HTMLInputElement>}
          type={type}
        />
      )
    }

    return (
      <div className="space-y-2">
        <label className={labelClasses}>
          {icon && <span className="inline-flex items-center mr-2">{icon}</span>}
          {label}
        </label>
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
              {icon}
            </div>
          )}
          
          {renderInput()}
        </div>

        {helper && !error && (
          <p className="text-xs text-text-secondary">{helper}</p>
        )}

        {error && (
          <div className="flex items-center space-x-1 text-red-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>
    )
  }
)

FormField.displayName = 'FormField'
