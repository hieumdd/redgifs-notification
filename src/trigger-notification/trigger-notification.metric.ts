import {
    processSingleMetric,
    processTopDimension,
} from './trigger-notification.service';

export const _7DayActiveUsersDaily = processSingleMetric({
    name: '7 Day Active Users',
    suffix: 'yesterday',
    threshold: 0.05,
    request: {
        dateRanges: [
            { startDate: 'yesterday', endDate: 'yesterday' },
            { startDate: 'today', endDate: 'today' },
        ],
        metrics: [{ name: 'active7DayUsers' }],
    },
});

export const totalUsersFromRedditWeekly = processSingleMetric({
    name: 'Total Users from Reddit',
    suffix: 'last week',
    threshold: 0.1,
    request: {
        dateRanges: [
            { startDate: '7daysAgo', endDate: 'today' },
            { startDate: '14daysAgo', endDate: '7daysAgo' },
        ],
        metrics: [{ name: 'totalUsers' }],
        dimensionFilter: {
            filter: {
                fieldName: 'sessionSource',
                stringFilter: {
                    matchType: 'CONTAINS',
                    value: 'reddit',
                    caseSensitive: false,
                },
            },
        },
    },
});
