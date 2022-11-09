import { http } from '@google-cloud/functions-framework';
import express from 'express';

import * as AlertService from './alert/alert.service';

const app = express();

app.use('/daily', async (req, res) => {
    await AlertService.daily();

    res.status(200).json({ status: 200 });
});

app.use('/weekly', async (req, res) => {
    await AlertService.weekly();

    res.status(200).json({ status: 200 });
});

http('main', app);
