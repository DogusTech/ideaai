// TogetLink UI Components
import { useState } from 'react'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // TO DO: Implement login logic
    }

    return (
        <form onSubmit={handleSubmit}>...</form>
    )
}