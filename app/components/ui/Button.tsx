// Import necessary libraries
import { FC } from 'react'

// Define Button component
interface Props {
    children: React.ReactNode
}

const Button: FC<Props> = ({ children }) => {
    return (
        <button className="bg-white/10 backdrop-blur hover:bg-white/20 transition duration-300 rounded-md p-2 text-white">{children}</button>
    )
}

export default Button