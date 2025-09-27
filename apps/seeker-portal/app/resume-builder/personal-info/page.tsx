import { ResponsiveResumeBuilder } from '../../../components/resume-builder/ResponsiveResumeBuilder';
import { PersonalInfoView } from '../../../components/resume-builder/PersonalInfoView';
import { MobilePersonalInfoView } from '../../../components/resume-builder/MobilePersonalInfoView';

export default function PersonalInfoPage() {
	return (
		<ResponsiveResumeBuilder mobileChildren={<MobilePersonalInfoView />}>
			<PersonalInfoView />
		</ResponsiveResumeBuilder>
	);
}
