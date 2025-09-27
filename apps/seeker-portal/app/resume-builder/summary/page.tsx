import { MobileSummaryView } from '../../../components/resume-builder/mobile/MobileSummaryView';
import { ResponsiveResumeBuilder } from '../../../components/resume-builder/ResponsiveResumeBuilder';
import { SummaryView } from '../../../components/resume-builder/SummaryView';

export default function SummaryPage() {
	return (
		<ResponsiveResumeBuilder mobileChildren={<MobileSummaryView />}>
			<SummaryView />
		</ResponsiveResumeBuilder>
	);
}
