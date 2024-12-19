"use client";

import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import {Bar, BarChart, XAxis, YAxis} from "recharts";
import {formatCompactNumber} from "@/lib/formatter";

type ViewsByCountryChartProps = {
    chartData: {
        views: number;
        countryName: string;
        countryCode: string;
    }[]
}
export default function ViewsByCountryChart({chartData}: ViewsByCountryChartProps) {

    if (chartData.length === 0) {
        return <p
            className=" text-2xl flex items-center justify-center min-h-[250px] max-h-[300px] text-muted-foreground text-neutral-600">No
            data available</p>
    }

    const chartConfig = {
        views: {
            label: "Visitors",
            color: "hsl(var(--accent))"
        }
    }

    return (
        <ChartContainer config={chartConfig} className="min-h-[150px] max-h-[250px] w-full">
            <BarChart data={chartData} margin={{top: 5, right: 10, left: 10, bottom: 5}}>
                <XAxis dataKey="countryName" tickLine={false} tickMargin={10}/>
                <YAxis tickLine={false} tickMargin={10} allowDecimals={false} tickFormatter={formatCompactNumber}/>
                <ChartTooltip content={<ChartTooltipContent nameKey={"countryName"}/>}/>
                <Bar dataKey={"views"} fill={"var(--color-views)"}/>
            </BarChart>
        </ChartContainer>
    );
}