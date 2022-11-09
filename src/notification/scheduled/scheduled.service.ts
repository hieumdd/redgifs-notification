import * as SingleMetric from './report/single-metric.report';
import * as TopDimension from './report/top-dimension.report';

export const scheduleds = [
    SingleMetric.generic,
    SingleMetric.reddit,
    TopDimension.generic,
    TopDimension.reddit,
];
