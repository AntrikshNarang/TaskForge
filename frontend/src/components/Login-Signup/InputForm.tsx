import React from 'react'
// define props
interface InputFormProps {
  label: string;
  placeholder: string;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputForm = (props: InputFormProps) => {
  return (
    <>
        {props.label && <label>{props.label}</label>}
        <input {...props}/>
    </>
  )
}