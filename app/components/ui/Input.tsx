// Import necessary libraries
import { FC } from 'react'

// Define Input component
interface Props {
    children: React.ReactNode
}

const Input: FC<Props> = ({ children }) => {
    return (
        <input className="bg-white/10 backdrop-blur hover:bg-white/20 transition duration-300 rounded-md p-2 text-white">{children}</input>
    )
}

export default Input