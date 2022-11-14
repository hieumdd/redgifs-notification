import { TODAY, YESTERDAY, THIS_MONTH } from './date-range.const';
import { eventReddit, topTag } from './report.service';

describe('Report Service', () => {
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
