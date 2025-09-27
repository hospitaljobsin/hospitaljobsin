import { ResponsiveResumeBuilder } from '../../../components/resume-builder/ResponsiveResumeBuilder';
import { SummaryView } from '../../../components/resume-builder/SummaryView';
import { MobileSummaryView } from '../../../components/resume-builder/MobileSummaryView';

export default function SummaryPage() {
	return (
		<ResponsiveResumeBuilder mobileChildren={<MobileSummaryView />}>
			<SummaryView />
		</ResponsiveResumeBuilder>
	);
}
