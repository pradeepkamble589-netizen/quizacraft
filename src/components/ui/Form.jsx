import React from 'react'

const FormLabel = ({ htmlFor, children, ...props }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium mb-2" {...props}>
    {children}
  </label>
)

const FormGroup = ({ children, className, ...props }) => (
  <div className={`mb-4 ${className || ""}`} {...props}>
    {children}
  </div>
)

export { FormLabel, FormGroup }