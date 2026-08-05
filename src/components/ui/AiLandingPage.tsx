import Link from 'next/link';
import { AiLandingPageProps } from '@/components/ui/AiLandingPage';

const AiLandingPage = ({ }: AiLandingPageProps) => {
    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
                Welcome to AiLandingPage
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-gray-500">
                This is a sample AiLandingPage page.
            </p>
            <Link href="/ai/login">
                <a className="text-blue-500 hover:text-blue-700">
                    Login
                </a>
            </Link>
            <Link href="/ai/register">
                <a className="text-blue-500 hover:text-blue-700">
                    Register
                </a>
            </Link>
        </div>
    );
};

export default AiLandingPage;