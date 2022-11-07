import { connect, disconnect } from '../snowflake/snowflake.service';
import {
    getAll,
    getCount,
    getCountByStartOfMonth,
    getCountByCompliant,
    getCountByTherapyModeGroup,
    getCountByAge,
    exportAll,
} from './patient.service';

import cases from '../common/config.test';

describe('Query', () => {
    beforeAll(async () => {
        await connect();
    });

    afterAll(async () => {
        await disconnect();
    });

    it.each(cases)('$name', async ({ options }) => {
        return getAll(options).then((data) => {
            expect(data).toBeTruthy();
        });
    });

    it('Options', async () => {
        return getAll({
            start: '2021-07-01',
            end: '2022-07-01',
            compliant: null,
            count: 10000,
            page: 0,
        }).then((data) => {
            expect(data).toBeTruthy();
        });
    });

    it('Count', async () => {
        return getCount(cases[1].options).then((data) =>
            expect(data).toBeTruthy(),
        );
    });

    it('Count by Start of Month', async () => {
        return getCountByStartOfMonth(cases[1].options).then((data) =>
            expect(data).toBeTruthy(),
        );
    });
    it('Count by Compliant', async () => {
        return getCountByCompliant(cases[1].options).then((data) => {
            expect(data).toBeTruthy();
        });
    });
    it('Count By Therapy Mode Group', async () => {
        return getCountByTherapyModeGroup(cases[1].options).then((data) =>
            expect(data).toBeTruthy(),
        );
    });
    it('Count By Age', async () => {
        return getCountByAge(cases[1].options).then((data) =>
            expect(data).toBeTruthy(),
        );
    });
});

describe('Export', () => {
    it('Export Start & End', async () => {
        return exportAll({
            count: 1,
            page: 1,
            start: '2022-01-01',
            end: '2022-02-01',
            therapyModeGroup: 'CPAP',
            over65: false,
            compliant: false,
            columns: ['PATIENTNAME','PATIENTDATEOFBIRTH']
        }).then((result) => {
            console.log(result);
            expect(result).toBeTruthy();
        });
    });
});
