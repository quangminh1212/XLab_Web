import React from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export const Container: React.FC<ContainerProps> = ({ 
  children,
  className = ''
}) => {
  return (
    <div className={cn('container mx-auto px-4 md:px-6 max-w-7xl', className)}>
      {children}
    </div>
  )
}

export default Container