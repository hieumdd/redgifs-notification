import * as SingleMetric from './report/single-metric.report';
import * as TopDimension from './report/top-dimension.report';

export const daily = [
    SingleMetric.daily,
    SingleMetric.dailyReddit,
    TopDimension.daily,
    TopDimension.dailyReddit,
];

export const weekly = [
    SingleMetric.weekly,
    SingleMetric.weeklyReddit,
    TopDimension.weekly,
    TopDimension.weeklyReddit,
];
