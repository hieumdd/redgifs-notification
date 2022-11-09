export const TriggerConfig = {
    DAILY: {
        dateRanges: [
            { startDate: 'today', endDate: 'today' },
            { startDate: 'yesterday', endDate: 'yesterday' },
        ],
        suffix: 'yesterday',
    },
    WEEKLY: {
        dateRanges: [
            { startDate: '7daysAgo', endDate: 'today' },
            { startDate: '14daysAgo', endDate: '7daysAgo' },
        ],
        suffix: 'last week',
    },
};
