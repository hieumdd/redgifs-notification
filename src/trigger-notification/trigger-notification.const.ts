import { protos } from '@google-analytics/data';
import IFilterExpression = protos.google.analytics.data.v1beta.IFilterExpression;

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

export const DimensionFilter: { [key: string]: IFilterExpression } = {
    REDDIT: {
        filter: {
            fieldName: 'sessionSource',
            stringFilter: {
                matchType: 'CONTAINS',
                value: 'reddit',
                caseSensitive: false,
            },
        },
    },
};
