import { useState } from 'react';
import Link from 'next/link';

export default function AiRouter() {
    const [login, setLogin] = useState(false);
    const [register, setRegister] = useState(false);

    return (
        <div>
            <h1>Ai Router</h1>
            <button onClick={() => setLogin(true)}>Login</button>
            <button onClick={() => setRegister(true)}>Register</button>
            {login && <Login />} // login state true, render Login component
            {register && <Register />} // register state true, render Register component
        </div>
    );
}