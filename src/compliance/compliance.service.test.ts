import { connect, disconnect } from '../snowflake/snowflake.service';
import { getAll, getCount } from './compliance.service';

import cases from '../common/config.test';

describe('Query', () => {
    beforeAll(async () => {
        await connect();
    });

    afterAll(async () => {
        await disconnect();
    });

    it('List', async () => {
        return getAll({ count: 10, page: 0 }).then((data) => {
            expect(data.length).toBe(10);
        });
    });

    it('Count', async () => {
        return getCount(cases[1].options).then((data) => {
            expect(data).toBeTruthy();
        });
    });
});
