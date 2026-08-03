<!-- Import necessary components -->
import { LoginForm } from '@/components/ui/LoginForm';
import { RegisterForm } from '@/components/ui/RegisterForm';

<!-- Define the register page -->
export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto p-8 bg-white/10 backdrop-blur shadow-md rounded-md">
      <RegisterForm />
    </div>
  );
}