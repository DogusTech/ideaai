import { Button } from '@/components/ui/Button';

function Button({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}>{children}</button>
  );
}

export default Button;