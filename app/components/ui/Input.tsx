// TOGETLINK INPUT COMPONENT
import { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    children: React.ReactNode
}

const Input = ({ children, ...props }: Props) => {
    return <input {...props}>{children}</input>
}

export default Input