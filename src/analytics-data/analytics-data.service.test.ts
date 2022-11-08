import { runReport } from './analytics-data.service';

it('Run Report', async () => {
    return runReport({
        dateRanges: [
            { startDate: 'yesterday', endDate: 'yesterday' },
            { startDate: 'today', endDate: 'today' },
        ],
        metrics: [{ name: 'active7DayUsers' }],
    }).then((response) => {
        console.log(response);
    });
});
