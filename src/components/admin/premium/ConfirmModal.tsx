'use client'

import React from 'react'
import { AlertTriangle, X, Trash2 } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  itemName?: string
  type?: 'delete' | 'warning' | 'info'
}

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  itemName, 
  type = 'delete' 
}: ConfirmModalProps) {
  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case 'delete': return <Trash2 className="w-5 h-5" />
      case 'warning': return <AlertTriangle className="w-5 h-5" />
      case 'info': return <AlertTriangle className="w-5 h-5" />
      default: return <AlertTriangle className="w-5 h-5" />
    }
  }

  const getColors = () => {
    switch (type) {
      case 'delete': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'info': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getButtonColors = () => {
    switch (type) {
      case 'delete': return 'bg-red-500 hover:bg-red-600 text-white'
      case 'warning': return 'bg-yellow-500 hover:bg-yellow-600 text-white'
      case 'info': return 'bg-blue-500 hover:bg-blue-600 text-white'
      default: return 'bg-gray-500 hover:bg-gray-600 text-white'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`relative w-full max-w-md mx-4 p-6 rounded-xl shadow-2xl ${getColors()} border`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${getColors().replace('border-', '')}`}>
              {getIcon()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              {itemName && (
                <p className="text-sm opacity-75">{itemName}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="text-white mb-6">
          <p className="text-sm opacity-90">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-surface/80 text-text-primary rounded-lg hover:bg-surface/70 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 ${getButtonColors()} rounded-lg transition-colors font-medium`}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  )
}
