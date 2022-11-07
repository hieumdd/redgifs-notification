import { Router } from 'express';

import { getController } from '../common/controller';
import { getAll, getCount } from './compliance.service';

export const complianceController = Router();
const complianceSummaryController = Router();

complianceController.get('/', getController(getAll));

complianceSummaryController.get('/', getController(getCount));

complianceController.use('/summary', complianceSummaryController);
