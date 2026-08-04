import { Container } from '../ui/container';

export default function Register() {
  return (
    <Container>
      <h1>Register</h1>
      <form>
        <label>
          Email:
          <input type='email' name='email' required />
        </label>
        <label>
          Password:
          <input type='password' name='password' required />
        </label>
        <label>
          Confirm Password:
          <input type='password' name='confirmPassword' required />
        </label>
        <button type='submit'>Register</button>
      </form>
    </Container>
  );
}