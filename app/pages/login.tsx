<!-- Import necessary components -->
import { LoginForm } from '@/components/ui/LoginForm';
import { RegisterForm } from '@/components/ui/RegisterForm';

<!-- Define the login page -->
export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto p-8 bg-white/10 backdrop-blur shadow-md rounded-md">
      <LoginForm />
    </div>
  );
}