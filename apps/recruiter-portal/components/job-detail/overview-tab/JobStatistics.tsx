import type { JobStatisticsFragment$key } from "@/__generated__/JobStatisticsFragment.graphql";
import { dateFormat } from "@/lib/intl";
import { Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";
import { useFragment } from "react-relay";
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
    viewerCount
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

	// Process the data for the chart
	const chartData = React.useMemo(() => {
		return data.viewMetricPoints.map((point) => ({
			date: dateFormat.format(new Date(point.timestamp)),
			views: point.count,
		}));
	}, [data.viewMetricPoints]);

	return (
		<Card className="p-6" shadow="none" fullWidth>
			<CardHeader className="w-full flex gap-6 justify-between">
				<h3 className="text-lg font-medium mb-4">{data.viewerCount} Views</h3>
			</CardHeader>
			<CardBody>
				<div style={{ width: "100%", height: 300 }}>
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
								<Tooltip />
								<Area
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
