import { Knex } from 'knex';

import { Snowflake } from '../snowflake/snowflake.service';
import { QueryOptions } from '../common/service';

export const compliantRepository = ({ patientName }: QueryOptions) => {
    const withCached = (qb: Knex.QueryBuilder) => {
        qb.withSchema('UTIL_DB.PUBLIC')
            .from('RESPIRONICS_COMPLIANCE_TAB')
            .select();

        if (patientName) {
            qb.where('PATIENTNAME', 'ILIKE', `%${patientName}%`);
        }

        return qb;
    };

    return Snowflake.with('cached', withCached).from('cached');
};
