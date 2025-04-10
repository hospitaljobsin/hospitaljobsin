import type { LucideProps } from "lucide-react";
import { Stethoscope } from "lucide-react";

export default function Logo(
	props: React.SVGProps<SVGSVGElement> & LucideProps,
) {
	return <Stethoscope {...props} />;
}
