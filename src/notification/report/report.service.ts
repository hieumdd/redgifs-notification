import { runReport } from '../../analytics-data/analytics-data.service';
import { Metric } from '../../analytics-data/metric.enum';
import { DimensionFilter } from '../notification.filter';
import { dateRanges } from './date-range.const';

export const [singleMetric, singleMetricReddit] = (() => {
    return [undefined, DimensionFilter.REDDIT].map((dimensionFilter) => {
        return async () => {
            return runReport({
                dateRanges,
                metrics: [
                    Metric.ACTIVE_7_DAY_USERS,
                    Metric.ACTIVE_28_DAY_USERS,
                    Metric.TOTAL_USERS,
                    Metric.SCREEN_PAGE_VIEWS,
                    Metric.AVERAGE_SESSION_DURATION,
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
        return async () => {
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
        return async () => {
            return runReport({
                dateRanges,
                metrics: [{ name: Metric.TOTAL_USERS }],
                dimensionFilter: { andGroup: { expressions } },
            });
        };
    });
})();

export const [topTag, topTagReddit] = (() => {
    return [undefined, DimensionFilter.REDDIT].map((dimensionFilter) => {
        return async () => {
            return runReport({
                dateRanges,
                dimensions: [{ name: 'customEvent:tag_name' }],
                metrics: [{ name: Metric.EVENT_COUNT }],
                dimensionFilter,
            });
        };
    });
})();

export const getReports = async () => {
    const [singleMetricResponse, singleMetricRedditResponse] =
        await Promise.all([singleMetric(), singleMetricReddit()]);

    const [gifViewsResponse, gifViewsRedditResponse] = await Promise.all([
        gifViews(),
        gifViewsReddit(),
    ]);

    const [loggedInUsersResponse, loggedInUsersRedditResponse] =
        await Promise.all([loggedInUsers(), loggedInUsersReddit()]);

    const [topTagResponse, topTagRedditResponse] = await Promise.all([
        topTag(),
        topTagReddit(),
    ]);

    return {
        singleMetricResponse,
        singleMetricRedditResponse,
        gifViewsResponse,
        gifViewsRedditResponse,
        loggedInUsersResponse,
        loggedInUsersRedditResponse,
        topTagResponse,
        topTagRedditResponse,
    };
};
