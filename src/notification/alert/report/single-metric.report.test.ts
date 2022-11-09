import { daily, weeklyReddit } from './single-metric.report';

describe('Single Metric Report', () => {
    const cases: [string, () => Promise<string[] | undefined>][] = [
        ['daily', daily],
        ['weekly-reddit', weeklyReddit],
    ];

    it.each(cases)('Run Report %p', async (_, report) => {
        return report().then((statement) => {
            console.log(statement);
        });
    });
});
