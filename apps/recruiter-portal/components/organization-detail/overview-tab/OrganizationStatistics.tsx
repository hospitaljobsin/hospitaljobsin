import type { OrganizationStatisticsFragment$key } from "@/__generated__/OrganizationStatisticsFragment.graphql";
import { dateFormat, dateTimeFormat } from "@/lib/intl";
import { Card, CardBody, CardHeader } from "@heroui/react";
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

const OrganizationStatisticsFragment = graphql`
fragment OrganizationStatisticsFragment on Organization {
    totalViewCount
    totalViewMetricPoints {
        timestamp
        count
    }
}
`;

type Props = {
	organization: OrganizationStatisticsFragment$key;
};

export default function OrganizationStatistics(props: Props) {
	const data = useFragment(OrganizationStatisticsFragment, props.organization);

	// Process the data for the chart
	const chartData = React.useMemo(() => {
		return data.totalViewMetricPoints.map((point) => {
			const date = new Date(point.timestamp);
			return {
				date: dateFormat.format(new Date(point.timestamp)),
				dateTime: dateTimeFormat.format(date),
				views: point.count,
			};
		});
	}, [data.totalViewMetricPoints]);

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
			<CardHeader className="w-full flex gap-6 justify-between">
				<h3 className="text-lg font-medium mb-4">
					{data.totalViewCount} Total Views
				</h3>
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
								<Tooltip content={<CustomTooltip />} />
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
