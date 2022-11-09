import { generic, reddit } from './single-metric.report';

describe('Scheduled Single Metric Report', () => {
    const cases: [string, () => Promise<string[] | undefined>][] = [
        ['generic', generic],
        ['reddit', reddit],
    ];

    it.each(cases)('Run Report %p', async (_, report) => {
        return report().then((statement) => {
            console.log(statement);
        });
    });
});
