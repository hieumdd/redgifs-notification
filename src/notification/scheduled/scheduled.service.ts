import * as SingleMetric from './report/single-metric.report';
import * as TopTag from './report/top-tag.report';

export const scheduleds = [
    SingleMetric.generic,
    SingleMetric.reddit,
    TopTag.generic,
    TopTag.reddit,
];
