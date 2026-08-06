import Link from 'next/link';
import { AiLandingPage } from '@/components/ui/AiLandingPage';

export default function Ai() {
    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <AiLandingPage />
            <Link href="/login">
                <a className="text-blue-600 hover:text-blue-800">
                    Login
                </a>
            </Link>
            <Link href="/register">
                <a className="text-blue-600 hover:text-blue-800">
                    Register
                </a>
            </Link>
        </div>
    );
}