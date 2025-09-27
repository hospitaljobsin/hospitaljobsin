import { ResponsiveResumeBuilder } from '../../../components/resume-builder/ResponsiveResumeBuilder';
import { AdditionalView } from '../../../components/resume-builder/AdditionalView';
import { MobileAdditionalView } from '../../../components/resume-builder/MobileAdditionalView';

export default function AdditionalPage() {
	return (
		<ResponsiveResumeBuilder mobileChildren={<MobileAdditionalView />}>
			<AdditionalView />
		</ResponsiveResumeBuilder>
	);
}
