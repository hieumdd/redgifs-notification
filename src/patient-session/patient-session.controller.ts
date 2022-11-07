import { Router } from 'express';

import { getController } from '../common/controller';
import { getAll, getCount } from './patient-session.service';

export const patientSessionController = Router();
const patientSessionSummaryController = Router();

patientSessionSummaryController.get('/', getController(getCount));

patientSessionController.get('/', getController(getAll));

patientSessionController.use('/summary', patientSessionSummaryController);
