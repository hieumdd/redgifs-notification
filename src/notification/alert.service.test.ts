import { getReports } from './report/report.service';
import { alertDaily } from './alert.service';

describe('Alert Service', () => {
    const cases: [string, (e: any) => string[]][] = [
        ['alert-daily', alertDaily],
    ];

    it.each(cases)('Alert %p', async (_, service) => {
        return getReports()
            .then(service)
            .then((texts) => {
                console.log(texts);
            })
            .catch((err) => {
                console.log(err);
            });
    });
});
