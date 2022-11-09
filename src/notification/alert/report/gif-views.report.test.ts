import { daily, dailyReddit, weekly, weeklyReddit } from './gif-views.report';

describe('Alert GIF Views', () => {
    const cases: [string, () => Promise<string[]>][] = [
        ['daily', daily],
        ['daily-reddit', dailyReddit],
        ['weekly', weekly],
        ['weekly-reddit', weeklyReddit],
    ];

    it.each(cases)('Run Report %p', async (_, report) => {
        return report().then((statement) => {
            console.log(statement);
        });
    });
});
