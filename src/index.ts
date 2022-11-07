import { http } from '@google-cloud/functions-framework';
import express from 'express';
import { queryParser } from 'express-query-parser';

import { patientSessionController } from './patient-session/patient-session.controller';
import { patientController } from './patient/patient.controller';
import { complianceController } from './compliance/compliance.controller';

const app = express();

app.use(
    queryParser({
        parseNull: true,
        parseBoolean: true,
    }),
);

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    } else {
        next();
    }
});

app.use('/patient-session', patientSessionController);
app.use('/patient', patientController);
app.use('/compliance', complianceController);

http('main', app);
