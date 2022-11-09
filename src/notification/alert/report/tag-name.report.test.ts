import { daily, dailyReddit } from './tag-name.report';

describe('Alert Tag Name', () => {
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
