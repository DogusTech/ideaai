import { Ai } from './Ai';

const Ai = () => {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginFailure, setLoginFailure] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerFailure, setRegisterFailure] = useState(false);

  const login = async (username, password) => {
    try {
      await Ai.login(username, password);
      setLoginSuccess(true);
      setLoginFailure(false);
    } catch (error) {
      setLoginSuccess(false);
      setLoginFailure(true);
    }
  };

  const register = async (username, password) => {
    try {
      await Ai.register(username, password);
      setRegisterSuccess(true);
      setRegisterFailure(false);
    } catch (error) {
      setRegisterSuccess(false);
      setRegisterFailure(true);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <Login login={login} />
      {loginFailure && <p>Login failed</p>}
      {loginSuccess && <p>Login successful</p>}
      <h1>Register</h1>
      <Register register={register} />
      {registerFailure && <p>Registration failed</p>}
      {registerSuccess && <p>Registration successful</p>}
    </div>
  );
};

export default Ai;