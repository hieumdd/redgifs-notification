import { http } from '@google-cloud/functions-framework';
import express from 'express';

import { alertDaily, alertWeekly } from './notification/alert.service';
import { scheduled } from './notification/scheduled.service';

const app = express();

app.use('/alert/daily', (req, res) => {
    alertDaily()
        .then((ok) => res.status(200).json({ ok }))
        .catch((err) => res.status(500).json({ err }));
});

app.use('/alert/weekly', (req, res) => {
    alertWeekly()
        .then((ok) => res.status(200).json({ ok }))
        .catch((err) => res.status(500).json({ err }));
});

app.use('/scheduled', (req, res) => {
    scheduled()
        .then((ok) => res.status(200).json({ ok }))
        .catch((err) => res.status(500).json({ err }));
});

http('main', app);
