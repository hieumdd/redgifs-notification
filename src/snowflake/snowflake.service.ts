import { Readable } from 'stream';
import { promisify } from 'util';
import snowflake from 'snowflake-sdk';
import knex from 'knex';

export type Data = {
    [key: string]: any;
};

export const Snowflake = knex({ client: 'pg' });

export const connection = snowflake.createConnection({
    account: 'twa58413.us-east-1',
    username: process.env.SF_USERNAME || '',
    password: process.env.SF_PASSWORD || '',
    authenticator: 'SNOWFLAKE',
});

export const connect = promisify(connection.connect);

export const disconnect = promisify(connection.destroy);

const ensureConnection = async () => {
    !connection.isUp() && (await connect());
};

export const queryGet = async (sqlText: string): Promise<Data[]> => {
    await ensureConnection();

    return new Promise((resolve, reject) => {
        connection.execute({
            sqlText,
            complete: (err, _, rows) =>
                err || !rows ? reject(err) : resolve(rows),
        });
    });
};

export const queryStream = async (sqlText: string): Promise<Readable> => {
    await ensureConnection();

    return connection.execute({ sqlText, streamResult: true }).streamRows();
};
