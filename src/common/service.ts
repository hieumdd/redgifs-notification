import { Knex } from 'knex';

import { Data, queryGet } from '../snowflake/snowflake.service';

export type QueryOptions = {
    count: number;
    page: number;
    start?: string;
    end?: string;
    patientName?: string;
    compliant?: boolean | null;
    therapyModeGroup?: string;
    over65?: boolean;
    columns?: string[];
};

export type QueryService = (options: QueryOptions) => Promise<Data[] | any>;

export const getService =
    (queryFn: (options: QueryOptions) => Knex.QueryBuilder): QueryService =>
    (options) =>
        queryGet(queryFn(options).toQuery());
