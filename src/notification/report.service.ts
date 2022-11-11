import { runReport } from '../analytics-data/analytics-data.service';
import { Metric } from '../analytics-data/metric.enum';
import { DimensionFilter } from './notification.filter';

export type DateRanges = { startDate: string; endDate: string }[];

export const [singleMetric, singleMetricReddit] = (() => {
    return [undefined, DimensionFilter.REDDIT].map((dimensionFilter) => {
        return async (dateRanges: DateRanges) => {
            return runReport({
                dateRanges,
                metrics: [
                    Metric.ACTIVE_7_DAY_USERS,
                    Metric.AVERAGE_SESSION_DURATION,
                    Metric.SCREEN_PAGE_VIEWS,
                    Metric.SESSIONS,
                    Metric.TOTAL_USERS,
                ].map((metric) => ({ name: metric })),
                dimensionFilter,
            });
        };
    });
})();

export const [gifViews, gifViewsReddit] = (() => {
    return [
        [DimensionFilter.GIF_VIEW],
        [DimensionFilter.GIF_VIEW, DimensionFilter.REDDIT],
    ].map((expressions) => {
        return async (dateRanges: DateRanges) => {
            return runReport({
                dateRanges,
                metrics: [{ name: Metric.EVENT_COUNT }],
                dimensionFilter: { andGroup: { expressions } },
            });
        };
    });
})();

export const [loggedInUsers, loggedInUsersReddit] = (() => {
    return [
        [DimensionFilter.LOGGED_IN],
        [DimensionFilter.LOGGED_IN, DimensionFilter.REDDIT],
    ].map((expressions) => {
        return async (dateRanges: DateRanges) => {
            return runReport({
                dateRanges,
                metrics: [{ name: Metric.TOTAL_USERS }],
                dimensionFilter: { andGroup: { expressions } },
            });
        };
    });
})();

export const [tagClicked, tagClickedReddit] = (() => {
    return [
        [DimensionFilter.TAG_CLICKED],
        [DimensionFilter.TAG_CLICKED, DimensionFilter.REDDIT],
    ].map((expressions) => {
        return async (dateRanges: DateRanges) => {
            return runReport({
                dateRanges,
                metrics: [{ name: Metric.EVENT_COUNT }],
                dimensionFilter: { andGroup: { expressions } },
            });
        };
    });
})();

export const [topTag, topTagReddit] = (() => {
    return [undefined, DimensionFilter.REDDIT].map((dimensionFilter) => {
        return async (dateRanges: DateRanges) => {
            return runReport({
                dateRanges,
                dimensions: [{ name: 'customEvent:tag_name' }],
                metrics: [{ name: Metric.EVENT_COUNT }],
                dimensionFilter,
                orderBys: [
                    {
                        desc: true,
                        metric: { metricName: Metric.EVENT_COUNT },
                    },
                ],
                limit: 5,
            });
        };
    });
})();

export const getReports = async (dateRanges: DateRanges) => {
    const [singleMetricResponse, singleMetricRedditResponse] =
        await Promise.all([
            singleMetric(dateRanges),
            singleMetricReddit(dateRanges),
        ]);

    const [gifViewsResponse, gifViewsRedditResponse] = await Promise.all([
        gifViews(dateRanges),
        gifViewsReddit(dateRanges),
    ]);

    const [loggedInUsersResponse, loggedInUsersRedditResponse] =
        await Promise.all([
            loggedInUsers(dateRanges),
            loggedInUsersReddit(dateRanges),
        ]);

    const [tagClickedResponse, tagClickedRedditResponse] = await Promise.all([
        tagClicked(dateRanges),
        tagClickedReddit(dateRanges),
    ]);

    const [topTagResponse, topTagRedditResponse] = await Promise.all([
        topTag(dateRanges),
        topTagReddit(dateRanges),
    ]);

    return {
        singleMetricResponse,
        singleMetricRedditResponse,
        gifViewsResponse,
        gifViewsRedditResponse,
        loggedInUsersResponse,
        loggedInUsersRedditResponse,
        tagClickedResponse,
        tagClickedRedditResponse,
        topTagResponse,
        topTagRedditResponse,
    };
};

export type Responses = Awaited<ReturnType<typeof getReports>>;
