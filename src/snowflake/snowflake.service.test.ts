import {
    Snowflake,
    connection,
    disconnect,
    queryGet,
    connect,
} from './snowflake.service';

it('Connect - Disconnect', async () => {
    await connect();

    expect(connection.isUp()).toBe(true);

    await disconnect();

    expect(connection.isUp()).toBe(false);
});

describe('Execute', () => {
    beforeEach(async () => {
        await connect();
    });

    afterEach(async () => {
        await disconnect();
    });

    it('Execute', async () => {
        const sql = Snowflake.select()
            .withSchema('LIVE DATA.RESPIRONICS')
            .from('PATIENTSESSIONS_SRC')
            .orderBy('PATIENTID')
            .limit(10)
            .offset(500)
            .toQuery();

        return queryGet(sql).then((data) => expect(data).toBeTruthy());
    });
});
