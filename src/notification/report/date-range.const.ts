export const DateRanges = {
    today: { startDate: 'today', endDate: 'today' },
    yesterday: { startDate: 'yesterday', endDate: 'yesterday' },
    thisWeek: { startDate: '7daysAgo', endDate: 'today' },
    lastWeek: { startDate: '14daysAgo', endDate: '7daysAgo' },
};

export const dateRanges = Object.values(DateRanges);
