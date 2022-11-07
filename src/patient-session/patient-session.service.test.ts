import { connect, disconnect } from '../snowflake/snowflake.service';
import { getAll, getCount } from './patient-session.service';

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

    it('Count', async () => {
        return getCount(cases[1].options).then((data) => {
            expect(data).toBeTruthy();
        });
    });
});
