import {subDays} from "date-fns";

export const CHART_INTERVALS = {
    last7Days: {
        label: "Last 7 days",
        startDate: subDays(new Date(), 7)
    },
    last30Days: {
        label: "Last 30 days",
        startDate: subDays(new Date(), 30)
    },
    last90Days: {
        label: "Last 90 days",
        startDate: subDays(new Date(), 90)
    },
    last365Days: {
        label: "Last 365 days",
        startDate: subDays(new Date(), 365)
    }
}