import React from 'react'

const Alert = ({ type = 'info', children, ...props }) => {
  const variants = {
    info: 'bg-primary-50 border-primary-200 text-primary-800',
    success: 'bg-success-50 border-success-200 text-success-800',
    error: 'bg-error-50 border-error-200 text-error-800',
    warning: 'bg-warning-50 border-warning-200 text-warning-800',
  }

  return (
    <div className={`rounded-lg border ${variants[type] || variants.info} p-4 mb-4`} {...props}>
      {children}
    </div>
  )
}

export default Alert