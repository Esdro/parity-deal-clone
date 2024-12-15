"use client";

import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import {Area, AreaChart, CartesianGrid, XAxis, YAxis} from "recharts";
import {formatCompactNumber} from "@/lib/formatter";

type ViewsByDayChartProps = {
    chartData: {
        date: string,
        views: number
    }[]
}
export default function ViewsByDayChart({chartData}: ViewsByDayChartProps) {

    // console.log(chartData);
    if (chartData.length === 0) {
        return <p
            className=" text-2xl flex items-center justify-center min-h-[250px] max-h-[300px] text-muted-foreground text-neutral-600">No
            data available</p>
    }

    const chartConfig = {
        views: {
            label: "Visitors",
            color: "hsl(var(--foreground))"
        }
    } satisfies ChartConfig;

    console.log(chartData);
    const data = chartData.map((item) => {
        return {
            ...item,
            date: item.date.replace("/2024",""),
        }
    });

    return (
        <ChartContainer config={chartConfig} className="min-h-[150px] max-h-[250px] w-full">
            <AreaChart data={data} margin={{top: 5, right: 10, left: 10, bottom: 5}}>
                <XAxis dataKey="date" tickLine={false} tickMargin={10}/>
                <YAxis tickLine={false} tickMargin={10} allowDecimals={false} tickFormatter={formatCompactNumber}/>
                <ChartTooltip content={<ChartTooltipContent indicator={"line"} nameKey={"date"}/>}/>
                <CartesianGrid vertical={true}/>
                <Area dataKey={"views"} fill={"var(--color-views)"}/>
            </AreaChart>
        </ChartContainer>
    );
}