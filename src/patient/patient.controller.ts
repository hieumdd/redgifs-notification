import { Router } from 'express';

import { parseQueryOptions, getController } from '../common/controller';
import {
    ExportOptions,
    getAll,
    getCount,
    getCountByStartOfMonth,
    getCountByCompliant,
    getCountByTherapyModeGroup,
    getCountByAge,
    exportAll,
} from './patient.service';

export const patientController = Router();
const patientSummaryController = Router();

patientController.get('/', getController(getAll));

patientController.post('/export', (req, res) => {
    const options = parseQueryOptions(req.body);

    if (!options.columns) {
        res.status(400).json({ err: 'Missing columns' });
    } else {
        exportAll(options as ExportOptions)
            .then((url) => res.json({ url }))
            .catch((err) => res.status(500).json({ err }));
    }
});

patientSummaryController.get('/', getController(getCount));

patientSummaryController.get(
    '/start-of-month',
    getController(getCountByStartOfMonth),
);

patientSummaryController.get('/compliant', getController(getCountByCompliant));

patientSummaryController.get(
    '/therapy-mode-group',
    getController(getCountByTherapyModeGroup),
);

patientSummaryController.get('/age', getController(getCountByAge));

patientController.use('/summary', patientSummaryController);
