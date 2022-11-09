import { daily, dailyReddit } from './top-tag.report';

describe('Alert Top Tag', () => {
    const cases: [string, () => Promise<string[]>][] = [
        ['daily', daily],
        ['daily-reddit', dailyReddit],
    ];

    it.each(cases)('Run Report %p', async (_, report) => {
        return report().then((statement) => {
            console.log(statement);
        });
    });
});
