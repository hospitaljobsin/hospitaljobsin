import type { JobStatisticsFragment$key } from "@/__generated__/JobStatisticsFragment.graphql";
import { dateFormat, dateTimeFormat } from "@/lib/intl";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { EyeIcon } from "lucide-react";
import React from "react";
import { useFragment } from "react-relay";
import type { TooltipProps } from "recharts";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { graphql } from "relay-runtime";

const JobStatisticsFragment = graphql`
fragment JobStatisticsFragment on Job {
    viewCount
    viewMetricPoints {
        timestamp
        count
    }
}
`;

type Props = {
	job: JobStatisticsFragment$key;
};

export default function JobStatistics(props: Props) {
	const data = useFragment(JobStatisticsFragment, props.job);

	// Create a formatter for date and time

	// Process the data for the chart
	const chartData = React.useMemo(() => {
		return data.viewMetricPoints.map((point) => {
			const date = new Date(point.timestamp);
			return {
				date: dateFormat.format(date),
				dateTime: dateTimeFormat.format(date),
				views: point.count,
			};
		});
	}, [data.viewMetricPoints]);

	// Custom tooltip to display date and time
	const CustomTooltip = ({ active, payload }: TooltipProps<string, string>) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-background p-3 border border-border rounded-md shadow-md">
					<p>{payload[0].payload.dateTime}</p>
					<p className="font-medium">{`Views: ${payload[0].value}`}</p>
				</div>
			);
		}
		return null;
	};

	return (
		<Card className="p-6" shadow="none" fullWidth>
			<CardHeader className="w-full flex gap-4 justify-start items-center">
				<EyeIcon size={24} />
				<h3 className="text-lg font-medium">{data.viewCount} Views</h3>
			</CardHeader>
			<CardBody>
				<div className="w-full h-48 sm:h-72">
					{chartData.length > 0 ? (
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart
								data={chartData}
								margin={{
									top: 15,
									right: 30,
									bottom: 5,
								}}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" dy={10} />
								<YAxis dx={-10} />
								<Tooltip content={<CustomTooltip />} />
								<Area
									isAnimationActive={false}
									type="natural"
									dataKey="views"
									name="Views"
									activeDot={{ r: 8 }}
									stroke="hsl(var(--heroui-primary-500))"
									fill="hsl(var(--heroui-primary-300))"
								/>
							</AreaChart>
						</ResponsiveContainer>
					) : (
						<div className="flex items-center justify-center h-full text-foreground-400">
							No view data available
						</div>
					)}
				</div>
			</CardBody>
		</Card>
	);
}
