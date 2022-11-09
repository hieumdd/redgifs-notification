import * as SingleMetric from './report/single-metric.report';
import * as TopTag from './report/top-tag.report';

export const daily = [
    SingleMetric.daily,
    SingleMetric.dailyGIFViews,
    SingleMetric.dailyLoggedInUsers,
    SingleMetric.dailyReddit,
    SingleMetric.dailyGIFViewsReddit,
    SingleMetric.dailyLoggedInUsersReddit,
    TopTag.daily,
    TopTag.dailyReddit,
];

export const weekly = [
    SingleMetric.weekly,
    SingleMetric.weeklyGIFViews,
    SingleMetric.weeklyLoggedInUsers,
    SingleMetric.weeklyReddit,
    SingleMetric.weeklyGIFViewsReddit,
    SingleMetric.weeklyLoggedInUsersReddit,
    TopTag.weekly,
    TopTag.weeklyReddit,
];
