import { http } from '@google-cloud/functions-framework';
import express from 'express';

import * as AlertService from './notification/alert/alert.service';
import * as ScheduledService from './notification/scheduled/scheduled.service';
import { notificationService } from './notification/notification.service';

const app = express();

app.use('/daily', async (req, res) => {
    await notificationService(AlertService.daily);
    await notificationService(ScheduledService.scheduleds);

    res.status(200).json({ status: 200 });
});

app.use('/weekly', async (req, res) => {
    await notificationService(AlertService.weekly);

    res.status(200).json({ status: 200 });
});

http('main', app);
