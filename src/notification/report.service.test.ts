import { TODAY, YESTERDAY, THIS_MONTH } from './date-range.const';
import { tagClicked, topTag } from './report.service';

describe('Report Service', () => {
    it('Tag Clicked', async () => {
        return tagClicked([TODAY, YESTERDAY, THIS_MONTH]).then((ok) => {
            expect(ok).toBe(true);
        });
    });

    it('Top Tag', async () => {
        return topTag([TODAY, YESTERDAY, THIS_MONTH]).then((ok) => {
            expect(ok).toBe(true);
        });
    });
});
