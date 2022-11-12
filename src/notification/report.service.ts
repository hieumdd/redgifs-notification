import { runReport } from '../analytics-data/analytics-data.service';
import { MetricKey } from '../analytics-data/metric.enum';
import { DimensionFilter } from './notification.filter';

export type DateRanges = { startDate: string; endDate: string }[];

export const [singleMetric, singleMetricReddit] = [
    undefined,
    DimensionFilter.REDDIT,
].map((dimensionFilter) => {
    return async (dateRanges: DateRanges) => {
        return runReport({
            dateRanges,
            metrics: [
                MetricKey.ACTIVE_7_DAY_USERS,
                MetricKey.AVERAGE_SESSION_DURATION,
                MetricKey.SCREEN_PAGE_VIEWS,
                MetricKey.SESSIONS,
                MetricKey.TOTAL_USERS,
            ].map((metric) => ({ name: metric })),
            dimensionFilter,
        });
    };
});

export const [event, eventReddit] = [[], [DimensionFilter.REDDIT]].map(
    (filters) => {
        return async (dateRanges: DateRanges) => {
            return runReport({
                dateRanges,
                dimensions: [{ name: 'eventName' }],
                metrics: [{ name: MetricKey.EVENT_COUNT }],
                dimensionFilter: {
                    andGroup: {
                        expressions: [
                            {
                                orGroup: {
                                    expressions: [
                                        DimensionFilter.TAG_CLICKED,
                                        DimensionFilter.GIF_VIEW,
                                    ],
                                },
                            },
                            ...filters,
                        ],
                    },
                },
            });
        };
    },
);

export const [loggedInUsers, loggedInUsersReddit] = [
    [DimensionFilter.LOGGED_IN],
    [DimensionFilter.LOGGED_IN, DimensionFilter.REDDIT],
].map((expressions) => {
    return async (dateRanges: DateRanges) => {
        return runReport({
            dateRanges,
            metrics: [{ name: MetricKey.TOTAL_USERS }],
            dimensionFilter: { andGroup: { expressions } },
        });
    };
});

export const [topTag, topTagReddit] = [undefined, DimensionFilter.REDDIT].map(
    (dimensionFilter) => {
        return async (dateRanges: DateRanges) => {
            return runReport({
                dateRanges,
                dimensions: [{ name: 'customEvent:tag_name' }],
                metrics: [{ name: MetricKey.EVENT_COUNT }],
                dimensionFilter,
                orderBys: [
                    {
                        desc: true,
                        metric: { metricName: MetricKey.EVENT_COUNT },
                    },
                ],
                limit: 5,
            });
        };
    },
);

export const getReports = async (dateRanges: DateRanges) => {
    const [singleMetricResponse, singleMetricRedditResponse] =
        await Promise.all([
            singleMetric(dateRanges),
            singleMetricReddit(dateRanges),
        ]);

    const [loggedInUsersResponse, loggedInUsersRedditResponse] =
        await Promise.all([
            loggedInUsers(dateRanges),
            loggedInUsersReddit(dateRanges),
        ]);

    const [eventResponse, eventRedditResponse] = await Promise.all([
        event(dateRanges),
        eventReddit(dateRanges),
    ]);

    const [topTagResponse, topTagRedditResponse] = await Promise.all([
        topTag(dateRanges),
        topTagReddit(dateRanges),
    ]);

    return {
        singleMetricResponse,
        singleMetricRedditResponse,

        loggedInUsersResponse,
        loggedInUsersRedditResponse,

        eventResponse,
        eventRedditResponse,

        topTagResponse,
        topTagRedditResponse,
    };
};

export type Responses = Awaited<ReturnType<typeof getReports>>;
