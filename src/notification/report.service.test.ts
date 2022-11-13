import * as SingleMetric from '../analytics-data/metric.const';
import { TODAY, YESTERDAY, THIS_MONTH } from './date-range.const';
import { event, eventReddit, topTag } from './report.service';
import { compareEvent } from './alert.processor';

describe('Report Service', () => {
    it('Event', async () => {
        return event([TODAY, YESTERDAY, THIS_MONTH]).then((res) => {
            expect(res.rowCount).toBeGreaterThanOrEqual(0);
            const statement = compareEvent(res, SingleMetric.gifViews, {
                threshold: 0.05,
                suffix: 'yesterday',
            });
            expect(statement).toBeTruthy()
        });
    });

    it('Event Reddit', async () => {
        return eventReddit([TODAY, YESTERDAY, THIS_MONTH]).then((res) => {
            expect(res.rowCount).toBeGreaterThanOrEqual(0);
        });
    });

    it('Top Tag', async () => {
        return topTag([TODAY, YESTERDAY, THIS_MONTH]).then((ok) => {
            expect(ok).toBe(true);
        });
    });
});
