import { MetricKey } from './metric.enum';

export type SingleMetric = {
    name: string;
    key: MetricKey | string;
};

export const active7DayUsers: SingleMetric = {
    name: 'Active 7 Day Users',
    key: MetricKey.ACTIVE_7_DAY_USERS,
};

export const totalUsers: SingleMetric = {
    name: 'Total Users',
    key: MetricKey.TOTAL_USERS,
};

export const totalUsersReddit: SingleMetric = {
    name: 'Total Users from Reddit',
    key: MetricKey.TOTAL_USERS,
};

export const loggedInUsers: SingleMetric = {
    name: 'Logged In Users',
    key: MetricKey.TOTAL_USERS,
};

export const loggedInUsersReddit: SingleMetric = {
    name: 'Logged In Users from Reddit',
    key: MetricKey.TOTAL_USERS,
};

export const gifViews: SingleMetric = {
    name: 'GIF Views',
    key: MetricKey.GIF_VIEW,
};

export const gifViewsReddit: SingleMetric = {
    name: 'GIF Views from Reddit',
    key: MetricKey.GIF_VIEW,
};

export const gifViewsPerSession: SingleMetric = {
    name: 'GIF Views per Session',
    key: MetricKey.EVENT_COUNT,
};

export const tagClicked: SingleMetric = {
    name: 'Tag Clicked',
    key: MetricKey.EVENT_COUNT,
};

export const tagClickedReddit: SingleMetric = {
    name: 'Tag Clicked from Reddit',
    key: MetricKey.EVENT_COUNT,
};

export const gifViewsPerSessionReddit: SingleMetric = {
    name: 'GIF Views per Session from Reddit',
    key: MetricKey.EVENT_COUNT,
};

export const pageViews: SingleMetric = {
    name: 'Page Views',
    key: MetricKey.SCREEN_PAGE_VIEWS,
};

export const pageViewsReddit: SingleMetric = {
    name: 'Page Views from Reddit',
    key: MetricKey.SCREEN_PAGE_VIEWS,
};

export const sessions: SingleMetric = {
    name: 'Sessions',
    key: MetricKey.SESSIONS,
};

export const sessionDuration: SingleMetric = {
    name: 'Session Duration',
    key: MetricKey.AVERAGE_SESSION_DURATION,
};

export const sessionDurationReddit: SingleMetric = {
    name: 'Session Duration from Reddit',
    key: MetricKey.AVERAGE_SESSION_DURATION,
};
