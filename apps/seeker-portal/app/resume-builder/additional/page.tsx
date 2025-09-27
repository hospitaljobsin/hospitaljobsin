import { AdditionalView } from '../../../components/resume-builder/AdditionalView';
import { MobileAdditionalView } from '../../../components/resume-builder/mobile/MobileAdditionalView';
import { ResponsiveResumeBuilder } from '../../../components/resume-builder/ResponsiveResumeBuilder';

export default function AdditionalPage() {
	return (
		<ResponsiveResumeBuilder mobileChildren={<MobileAdditionalView />}>
			<AdditionalView />
		</ResponsiveResumeBuilder>
	);
}
