import { ResponsiveResumeBuilder } from '../../../components/resume-builder/ResponsiveResumeBuilder';
import { CertificationsView } from '../../../components/resume-builder/CertificationsView';
import { MobileCertificationsView } from '../../../components/resume-builder/MobileCertificationsView';

export default function CertificationsPage() {
	return (
		<ResponsiveResumeBuilder mobileChildren={<MobileCertificationsView />}>
			<CertificationsView />
		</ResponsiveResumeBuilder>
	);
}
