import { MobileSkillsView } from '../../../components/resume-builder/mobile/MobileSkillsView';
import { ResponsiveResumeBuilder } from '../../../components/resume-builder/ResponsiveResumeBuilder';
import { SkillsView } from '../../../components/resume-builder/SkillsView';

export default function SkillsPage() {
	return (
		<ResponsiveResumeBuilder mobileChildren={<MobileSkillsView />}>
			<SkillsView />
		</ResponsiveResumeBuilder>
	);
}
