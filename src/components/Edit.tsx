'use client'

import { Edit as EditIcon } from 'lucide-react'

interface EditProps {
  className?: string
}

export default function Edit({ className = "w-4 h-4" }: EditProps) {
  return (
    <EditIcon className={className} />
  )
}
