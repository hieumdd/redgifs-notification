import { pipeline } from 'stream/promises';

import json2csv from 'json2csv';
import dayjs from 'dayjs';

import { Data, queryGet, queryStream } from '../snowflake/snowflake.service';
import { QueryOptions, getService } from '../common/service';
import { patientRepository } from './patient.repository';
import { createExportCSV } from '../storage/storage.service';

export const getCountService = (columns?: string[]) =>
    getService((options) => {
        const count = patientRepository(options).count('PATIENTID', {
            as: 'COUNT',
        });

        columns && count.select(columns).groupBy(columns);

        return count;
    });

export const getCount = getCountService();

export const getCountByStartOfMonth = getCountService(['STARTOFMONTH_MAX']);

export const getCountByCompliant = getCountService(['LASTCOMPLIANT']);

export const getCountByTherapyModeGroup = getCountService([
    'LASTTHERAPYMODEGROUP',
]);

export const getCountByAge = getCountService(['LASTOVER65']);

export const getAll = async (options: QueryOptions) => {
    const { count, page } = options;

    const dataSql = patientRepository(options)
        .select()
        .orderBy('MAXTHERAPYDATE', 'desc')
        .limit(count)
        .offset(count * page);

    const [data, queryCount] = await Promise.all([
        queryGet(dataSql.toQuery()),
        getCount(options),
    ]);

    return {
        count: queryCount.pop()?.COUNT,
        data,
    };
};

export type ExportOptions = QueryOptions & {
    columns: string[];
};
export const exportAll = async (options: ExportOptions) => {
    const exportFile = createExportCSV();
    const sql = patientRepository(options)
        .orderBy('THERAPYDATE', 'desc')
        .select(options.columns);

    const transform = (row: Data[]) => {
        const kvs = Object.entries(row).map(([key, value]) => [
            key,
            value instanceof Date ? dayjs(value).format('YYYY-MM-DD') : value,
        ]);
        return Object.fromEntries(kvs);
    };

    return queryStream(sql.toQuery())
        .then((resultStream) => {
            const transformer = new json2csv.Transform(
                {
                    transforms: [transform],
                },
                { objectMode: true },
            );
            return pipeline(
                resultStream,
                transformer,
                exportFile.createWriteStream({ contentType: 'text/csv' }),
            );
        })
        .then(() => exportFile.publicUrl());
};
