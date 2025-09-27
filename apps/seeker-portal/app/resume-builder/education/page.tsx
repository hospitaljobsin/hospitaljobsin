import { EducationView } from '../../../components/resume-builder/EducationView';
import { MobileEducationView } from '../../../components/resume-builder/mobile/MobileEducationView';
import { ResponsiveResumeBuilder } from '../../../components/resume-builder/ResponsiveResumeBuilder';

export default function EducationPage() {
	return (
		<ResponsiveResumeBuilder mobileChildren={<MobileEducationView />}>
			<EducationView />
		</ResponsiveResumeBuilder>
	);
}
