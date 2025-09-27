import { MobileWorkExperienceView } from '../../../components/resume-builder/mobile/MobileWorkExperienceView';
import { ResponsiveResumeBuilder } from '../../../components/resume-builder/ResponsiveResumeBuilder';
import { WorkExperienceView } from '../../../components/resume-builder/WorkExperienceView';

export default function WorkExperiencePage() {
	return (
		<ResponsiveResumeBuilder mobileChildren={<MobileWorkExperienceView />}>
			<WorkExperienceView />
		</ResponsiveResumeBuilder>
	);
}
