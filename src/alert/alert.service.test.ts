import { daily, weekly } from './alert.service';

describe('Alert Service', () => {
    const cases: [string, () => Promise<any>][] = [
        ['daily', daily],
        ['weekly', weekly],
    ];

    it.each(cases)('Alert %p', async (_, service) => {
        return service().then((response) => {
            console.log(response);
            expect(response.ok).toBe(true);
        });
    });
});
