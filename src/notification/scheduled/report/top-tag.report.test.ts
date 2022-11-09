import { generic, reddit } from './top-tag.report';

describe('Scheduled Top Dimension Report', () => {
    const cases: [string, () => Promise<string[]>][] = [
        ['generic', generic],
        ['reddit', reddit],
    ];

    it.each(cases)('Run Report %p', async (_, report) => {
        return report().then((statement) => {
            console.log(statement);
        });
    });
});
