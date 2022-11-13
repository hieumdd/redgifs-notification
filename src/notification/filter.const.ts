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
    LOGGED_IN: {
        filter: {
            fieldName: 'customEvent:is_user_logged_in',
            stringFilter: {
                matchType: 'EXACT',
                value: 'true',
                caseSensitive: false,
            },
        },
    },
    GIF_VIEW: {
        filter: {
            fieldName: 'eventName',
            stringFilter: {
                matchType: 'EXACT',
                value: 'gif_view',
                caseSensitive: false,
            },
        },
    },
    TAG_CLICKED: {
        filter: {
            fieldName: 'eventName',
            stringFilter: {
                matchType: 'EXACT',
                value: 'tag_clicked',
                caseSensitive: false,
            },
        },
    },
};
