import { MobilePersonalInfoView } from '../../../components/resume-builder/mobile/MobilePersonalInfoView';
import { PersonalInfoView } from '../../../components/resume-builder/PersonalInfoView';
import { ResponsiveResumeBuilder } from '../../../components/resume-builder/ResponsiveResumeBuilder';

export default function PersonalInfoPage() {
	return (
		<ResponsiveResumeBuilder mobileChildren={<MobilePersonalInfoView />}>
			<PersonalInfoView />
		</ResponsiveResumeBuilder>
	);
}
