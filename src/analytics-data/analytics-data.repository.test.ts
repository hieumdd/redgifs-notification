import { PROPERTY_ID, client } from './analytics-data.repository';
import { getDataForDateRange, processTopDimension } from './analytics-data.service';

it('Run Report', async () => {
    return client
        .runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [
                { startDate: 'yesterday', endDate: 'yesterday' },
                { startDate: 'today', endDate: 'today' },
            ],
            metrics: [{ name: 'active7DayUsers' }],
        })
        .then(([response]) => response)
        .then((response) => {
            console.log(response);
        });
});

it('Run Report with Filter', async () => {
    return client
        .runReport({
            property: `properties/${PROPERTY_ID}`,
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
        })
        .then(([response]) => response)
        .then((response) => {
            const x = getDataForDateRange(response, 0);
            console.log(response);
        });
});

it('Run Report with Custom Dimension', async () => {
    return client
        .runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [
                { startDate: '7daysAgo', endDate: 'today' },
                { startDate: '14daysAgo', endDate: '7daysAgo' },
            ],
            dimensions: [
                {
                    name: 'customEvent:tag_name',
                },
            ],
            metrics: [{ name: 'eventCount' }],
        })
        .then(([response]) => response)
        .then((response) => {
            const x = processTopDimension(response, 0);
            console.log(response);
        });
});
