import { ResponsiveResumeBuilder } from '../../../components/resume-builder/ResponsiveResumeBuilder';
import { SkillsView } from '../../../components/resume-builder/SkillsView';
import { MobileSkillsView } from '../../../components/resume-builder/MobileSkillsView';

export default function SkillsPage() {
	return (
		<ResponsiveResumeBuilder mobileChildren={<MobileSkillsView />}>
			<SkillsView />
		</ResponsiveResumeBuilder>
	);
}
