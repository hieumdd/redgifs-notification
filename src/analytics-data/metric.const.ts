import { Metric } from './metric.enum';

export type SingleMetric = {
    name: string;
    key: Metric;
};

export const active7DayUsers: SingleMetric = {
    name: 'Active 7 Day Users',
    key: Metric.ACTIVE_7_DAY_USERS,
};

export const active28DayUsers: SingleMetric = {
    name: 'Active 28 Day Users',
    key: Metric.ACTIVE_28_DAY_USERS,
};

export const totalUsers: SingleMetric = {
    name: 'Total Users',
    key: Metric.TOTAL_USERS,
};

export const totalUsersReddit: SingleMetric = {
    name: 'Total Users from Reddit',
    key: Metric.TOTAL_USERS,
};

export const loggedInUsers: SingleMetric = {
    name: 'Logged In Users',
    key: Metric.TOTAL_USERS,
};

export const loggedInUsersReddit: SingleMetric = {
    name: 'Logged In Users from Reddit',
    key: Metric.TOTAL_USERS,
};

export const gifViews: SingleMetric = {
    name: 'GIF Views',
    key: Metric.EVENT_COUNT,
};

export const gifViewsReddit: SingleMetric = {
    name: 'GIF Views from Reddit',
    key: Metric.EVENT_COUNT,
};

export const gifViewsPerSession: SingleMetric = {
    name: 'GIF Views per Session',
    key: Metric.EVENT_COUNT,
};

export const gifViewsPerSessionReddit: SingleMetric = {
    name: 'GIF Views per Session from Reddit',
    key: Metric.EVENT_COUNT,
};

export const pageViews: SingleMetric = {
    name: 'Page Views',
    key: Metric.SCREEN_PAGE_VIEWS,
};

export const pageViewsReddit: SingleMetric = {
    name: 'Page Views from Reddit',
    key: Metric.SCREEN_PAGE_VIEWS,
};

export const sessions: SingleMetric = {
    name: 'Sessions',
    key: Metric.SESSIONS,
};

export const sessionDuration: SingleMetric = {
    name: 'Session Duration',
    key: Metric.AVERAGE_SESSION_DURATION,
};

export const sessionDurationReddit: SingleMetric = {
    name: 'Session Duration from Reddit',
    key: Metric.AVERAGE_SESSION_DURATION,
};
