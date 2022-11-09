import * as SingleMetric from './report/single-metric.report';
import * as TagName from './report/tag-name.report';

export const daily = [
    SingleMetric.daily,
    SingleMetric.dailyGIFViews,
    SingleMetric.dailyLoggedInUsers,
    SingleMetric.dailyReddit,
    SingleMetric.dailyGIFViewsReddit,
    SingleMetric.dailyLoggedInUsersReddit,
    TagName.daily,
    TagName.dailyReddit,
];

export const weekly = [
    SingleMetric.weekly,
    SingleMetric.weeklyGIFViews,
    SingleMetric.weeklyLoggedInUsers,
    SingleMetric.weeklyReddit,
    SingleMetric.weeklyGIFViewsReddit,
    SingleMetric.weeklyLoggedInUsersReddit,
    TagName.weekly,
    TagName.weeklyReddit,
];
