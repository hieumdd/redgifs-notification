import { Knex } from 'knex';

import { Snowflake } from '../snowflake/snowflake.service';
import { QueryOptions } from '../common/service';

export const patientRepository = (options: QueryOptions) => {
    const withCached = (qb: Knex.QueryBuilder) => {
        qb.withSchema('UTIL_DB.PUBLIC')
            .from('RESPIRONICS_PATIENTS_CACHED')
            .select();

        if (options.start && options.end) {
            qb.whereBetween('MAXTHERAPYDATE', [options.start, options.end]);
        }

        if (options.patientName !== undefined) {
            qb.where('PATIENTNAME', 'ILIKE', `%${options.patientName}%`);
        }

        if (options.compliant !== undefined) {
            qb.where('LASTCOMPLIANT', options.compliant);
        }

        if (options.therapyModeGroup !== undefined) {
            qb.where('LASTTHERAPYMODEGROUP', options.therapyModeGroup);
        }

        if (options.over65 !== undefined) {
            qb.where('LASTOVER65', options.over65);
        }

        return qb;
    };

    return Snowflake.with('cached', withCached).from('cached');
};
