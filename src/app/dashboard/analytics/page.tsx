import React, {Suspense} from 'react';
import {auth} from "@clerk/nextjs/server";
import HasPermission from "@/components/HasPermission";
import {canAccessAnalytics} from "@/server/permissions";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {getViewsByCountryChartData, getViewsByPPPChartData} from "@/server/db/productViews";
import {CHART_INTERVALS} from "@/lib/constants";
import ViewsByCountryChart from "@/app/dashboard/_components/charts/by-country";
import ViewsByPPPChart from "@/app/dashboard/_components/charts/by-ppp";

export default async function AnalyticsPage({searchParams}) {
    const {interval, timezone, productId} = await searchParams;
    const {userId, redirectToSignIn} = await auth();

    if (!userId) return redirectToSignIn();

    const countryCardProps = {
        timezone: timezone ?? 'UTC',
        productId, userId,
        interval: CHART_INTERVALS[interval as keyof typeof CHART_INTERVALS] ?? CHART_INTERVALS.last90Days
    };

    const permission = await canAccessAnalytics(userId);
    return (
        <>
            <h1 className="text-3xl font-semibold mb-8">Analytics </h1>
            <HasPermission permission={permission} renderFallback>
                <div className="flex flex-col gap-8">
                    <ViewsByDayCard/>
                    <Suspense fallback={<p>Loading...</p>}>
                        <ViewsByPPPCard  {...countryCardProps}/>
                    </Suspense>
                    <ViewsByCountryCard  {...countryCardProps} />
                </div>
            </HasPermission>
        </>
    );
}


async function ViewsByDayCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl text-muted-foreground"> Views per day </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-neutral-600">Coming soon</p>
            </CardContent>
        </Card>
    )
}

async function ViewsByPPPCard(props: CountryChartDataProps) {
    const chartData = await getViewsByPPPChartData(props);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl text-muted-foreground"> Views per PPP Group  </CardTitle>
            </CardHeader>
            <CardContent>
                <ViewsByPPPChart chartData={chartData}/>
            </CardContent>
        </Card>
    )
}

type CountryChartDataProps = Parameters<typeof getViewsByCountryChartData>[0]


async function ViewsByCountryCard(props: CountryChartDataProps) {

    const chartData = await getViewsByCountryChartData(props);

    // console.log("chartData", chartData)
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl text-muted-foreground">Views per country </CardTitle>
            </CardHeader>
            <CardContent>
                <ViewsByCountryChart chartData={chartData}/>
            </CardContent>
        </Card>
    )
}

