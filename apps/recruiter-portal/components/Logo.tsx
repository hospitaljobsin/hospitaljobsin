import type { LucideProps } from "lucide-react";
import { Building2 } from "lucide-react";

export default function Logo(
	props: React.SVGProps<SVGSVGElement> & LucideProps,
) {
	return <Building2 {...props} />;
}
