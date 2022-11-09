import * as SingleMetricReport from './single-metric.report';

describe('Single Metric Report', () => {
    const cases: [string, () => Promise<string[]>][] = [
        ['daily', SingleMetricReport.daily],
        ['daily-gif-views', SingleMetricReport.dailyGIFViews],
        ['daily-logged-in-users', SingleMetricReport.dailyLoggedInUsers],
        ['weekly', SingleMetricReport.weekly],
        ['weekly-gif-views', SingleMetricReport.weeklyGIFViews],
        ['weekly-logged-in-users', SingleMetricReport.weeklyLoggedInUsers],
        ['daily-reddit', SingleMetricReport.dailyReddit],
        ['daily-gif-views-reddit', SingleMetricReport.dailyGIFViewsReddit],
        [
            'daily-logged-in-users-reddit',
            SingleMetricReport.dailyLoggedInUsersReddit,
        ],
        ['weekly-reddit', SingleMetricReport.weeklyReddit],
        ['weekly-gif-views-reddit', SingleMetricReport.weeklyGIFViewsReddit],
        [
            'weekly-logged-in-users-reddit',
            SingleMetricReport.weeklyLoggedInUsersReddit,
        ],
    ];

    it.each(cases)('Run Report %p', async (_, report) => {
        return report().then((statement) => {
            console.log(statement);
        });
    });
});
