import { TODAY, YESTERDAY, THIS_MONTH } from './date-range.const';
import { topTag } from './report.service';

describe('Report Service', () => {
    it('Run %p', async () => {
        return topTag([TODAY, YESTERDAY, THIS_MONTH]).then((ok) => {
            expect(ok).toBe(true);
        });
    });
});
