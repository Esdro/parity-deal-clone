"use client";

import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import {Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis} from "recharts";
import {formatCompactNumber} from "@/lib/formatter";

type ViewsByPPPChartProps = {
    chartData: {
        views: number;
        pppName: string;
    }[]
}
export default function ViewsByPPPChart({chartData}: ViewsByPPPChartProps) {

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


    const data = chartData.map((item) => {
        return {
            ...item,
            pppName: item.pppName.replace("Parity Group: ", ""),
        }
    });
    return (
        <ChartContainer config={chartConfig} className="min-h-[150px] max-h-[250px] w-full">
            <BarChart data={data} margin={{top: 5, right: 10, left: 10, bottom: 5}}>
                <XAxis dataKey="pppName" tickLine={false} tickMargin={10}/>
                <YAxis tickLine={false} tickMargin={10} allowDecimals={false} tickFormatter={formatCompactNumber}/>
                <ChartTooltip content={<ChartTooltipContent indicator={"line"} nameKey={"pppName"}/>}/>
                <CartesianGrid vertical={true} />
                <Bar dataKey={"views"} fill={"var(--color-views)"}/>
            </BarChart>
        </ChartContainer>
    );
}