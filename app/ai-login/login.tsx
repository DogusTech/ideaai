import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { signInGuest } from '@/firebase';

export default function Login() {
  const router = useRouter();

  const handleGuest = async () => {
    try {
      await signInGuest();
      // after anonymous sign‑in, navigate to the main app
      router.push('/');
    } catch (e) {
      console.error('Guest sign‑in failed', e);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      {/* Existing email/password form could stay here if needed */}
      <Button onClick={handleGuest} color="primary" auto>
        Continue as Guest
      </Button>
    </div>
  );
}
