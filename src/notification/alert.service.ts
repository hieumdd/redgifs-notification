import * as SingleMetric from '../analytics-data/metric.const';
import { getReports } from './report/report.service';
import { compareDimensionDoD, compareMetricDoD } from './response.processor';

export const alertDaily = (
    responses: Awaited<ReturnType<typeof getReports>>,
) => {
    const [active7DayUsers, active28DayUsers, totalUsers] = [
        SingleMetric.active7DayUsers,
        SingleMetric.active28DayUsers,
        SingleMetric.totalUsers,
    ].map((metric) => compareMetricDoD(responses.singleMetricResponse, metric));

    const totalUsersReddit = compareMetricDoD(
        responses.singleMetricRedditResponse,
        SingleMetric.totalUsersReddit,
    );

    const gifViews = compareMetricDoD(
        responses.gifViewsResponse,
        SingleMetric.gifViews,
    );

    const gifViewsReddit = compareMetricDoD(
        responses.gifViewsRedditResponse,
        SingleMetric.gifViewsReddit,
    );

    const loggedInUsers = compareMetricDoD(
        responses.loggedInUsersResponse,
        SingleMetric.loggedInUsers,
    );

    const loggedInUsersReddit = compareMetricDoD(
        responses.loggedInUsersRedditResponse,
        SingleMetric.loggedInUsersReddit,
    );

    const topTag = compareDimensionDoD(responses.topTagResponse, {
        name: 'Top Tag',
    });

    const topTagReddit = compareDimensionDoD(responses.topTagResponse, {
        name: 'Top Tag from Reddit',
    });

    return [
        active7DayUsers,
        active28DayUsers,
        totalUsers,
        totalUsersReddit,
        gifViews,
        gifViewsReddit,
        loggedInUsers,
        loggedInUsersReddit,
        topTag,
        topTagReddit,
    ];
};
