export const TriggerConfig = {
    DAILY: {
        dateRanges: [
            { startDate: 'today', endDate: 'today' },
            { startDate: 'yesterday', endDate: 'yesterday' },
        ],
        threshold: 0.05,
        suffix: 'yesterday',
    },
    WEEKLY: {
        dateRanges: [
            { startDate: '7daysAgo', endDate: 'today' },
            { startDate: '14daysAgo', endDate: '7daysAgo' },
        ],
        threshold: 0.1,
        suffix: 'last week',
    },
};
