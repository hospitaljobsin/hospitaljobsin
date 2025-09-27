import { ResponsiveResumeBuilder } from '../../../components/resume-builder/ResponsiveResumeBuilder';
import { EducationView } from '../../../components/resume-builder/EducationView';
import { MobileEducationView } from '../../../components/resume-builder/MobileEducationView';

export default function EducationPage() {
	return (
		<ResponsiveResumeBuilder mobileChildren={<MobileEducationView />}>
			<EducationView />
		</ResponsiveResumeBuilder>
	);
}
