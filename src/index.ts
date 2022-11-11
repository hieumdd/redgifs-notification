import { http } from '@google-cloud/functions-framework';
import express from 'express';

import { alertDaily, alertWeekly } from './notification/alert.service';
import { scheduled } from './notification/scheduled.service';

const app = express();

app.use('/daily', async (req, res) => {
    try {
        await scheduled();
        await alertDaily();
        res.status(200).json({ status: 200 });
    } catch (err) {
        res.status(500).json({ err });
    }
});

app.use('/weekly', async (req, res) => {
    alertWeekly()
        .then(() => {
            res.status(200).json({ status: 200 });
        })
        .catch((err) => {
            res.status(500).json({ err });
        });
});

http('main', app);
