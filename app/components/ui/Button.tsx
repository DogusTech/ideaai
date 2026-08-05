// TOGETLINK BUTTON COMPONENT
import { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
}

const Button = ({ children, ...props }: Props) => {
    return <button {...props}>{children}</button>
}

export default Button