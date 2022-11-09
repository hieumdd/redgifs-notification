import { Metric } from '../../analytics-data/metric.enum';

export type SingleMetric = {
    name: string;
    key: Metric;
};

export const active7DayUsers: SingleMetric = {
    name: 'Active 7 Day Users',
    key: Metric.ACTIVE_7_DAY_USERS,
};

export const totalUsers: SingleMetric = {
    name: 'Total Users',
    key: Metric.TOTAL_USERS,
};
