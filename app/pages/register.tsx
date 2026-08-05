import CorporateBackground from './CorporateBackground';

const RegisterPage = () => {
  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md">
      <CorporateBackground />
      <h1 className="text-3xl font-bold mb-4">Register</h1>
      <form>
        <input type="text" placeholder="Username" className="block w-full p-2 mb-4" />
        <input type="password" placeholder="Password" className="block w-full p-2 mb-4" />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;