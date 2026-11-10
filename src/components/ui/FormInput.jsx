import React from 'react'
import { FormLabel, FormGroup } from './Form'
import Input from './Input'

const FormInput = ({ type, value, onChange, placeholder, label, disabled, ...props }) => (
  <FormGroup>
    <FormLabel htmlFor="input">{label}</FormLabel>
    <Input
      id="input"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      {...props}
    />
  </FormGroup>
)

export default FormInput