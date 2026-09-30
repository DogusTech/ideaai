// TogetLink UI Components
import { useState } from 'react'

const Register = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // TO DO: Implement register logic
    }

    return (
        <form onSubmit={handleSubmit}>...</form>
    )
}