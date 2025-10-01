import type { Metadata } from 'next';
import LandingView from '@/components/landing/LandingView';

export const metadata: Metadata = {
	title: 'Healthcare Recruitment Platform | Smarter Hiring with AI'
};

export default function Landing() {
	return <LandingView />;
}
