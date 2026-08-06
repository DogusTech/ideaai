import Link from 'next/link';
import { AiLandingPage } from '@/components/ui/AiLandingPage';

export default function AiLandingPage() {
    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
                Welcome to AiLandingPage
            </h1>
            <Link href="/ai">
                <a className="text-blue-600 hover:text-blue-800">
                    Go to Ai
                </a>
            </Link>
        </div>
    );
}