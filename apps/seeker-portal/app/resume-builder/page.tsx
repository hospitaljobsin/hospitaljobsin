import links from '@/lib/links';
import { redirect } from 'next/navigation';

export default function ResumeBuilderPage() {
	redirect(links.resumeBuilderPersonalInfo);
}
