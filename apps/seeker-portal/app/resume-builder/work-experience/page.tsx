import { ResponsiveResumeBuilder } from '../../../components/resume-builder/ResponsiveResumeBuilder';
import { WorkExperienceView } from '../../../components/resume-builder/WorkExperienceForm';
import { MobileWorkExperienceView } from '../../../components/resume-builder/MobileWorkExperienceView';

export default function WorkExperiencePage() {
	return (
		<ResponsiveResumeBuilder mobileChildren={<MobileWorkExperienceView />}>
			<WorkExperienceView />
		</ResponsiveResumeBuilder>
	);
}
