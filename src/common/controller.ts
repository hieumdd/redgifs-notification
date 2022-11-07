import { Handler } from 'express';

import { QueryOptions, QueryService } from './service';

export const parseQueryOptions = (query: any): QueryOptions => {
    const {
        count,
        page,
        start,
        end,
        patientName,
        therapyModeGroup,
        compliant,
        over65,
        columns,
    } = query;

    return {
        count: parseInt(count || '500'),
        page: parseInt(page || '0'),
        start,
        end,
        patientName: patientName ? decodeURI(patientName) : undefined,
        therapyModeGroup,
        compliant,
        over65,
        columns,
    };
};

export const getController =
    (service: QueryService): Handler =>
    (req, res) => {
        service(parseQueryOptions(req.query))
            .then((data) => res.json({ data }))
            .catch((err) => res.status(500).json({ error: err.message }));
    };
