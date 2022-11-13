import { createPlainTextSection, postMessage } from '../slack/slack.service';
import { alertDaily, alertWeekly } from './alert.service';
import { scheduled } from './scheduled.service';

describe('Notification Service', () => {
    const cases: [string, () => Promise<boolean>][] = [
        // ['alert-daily', alertDaily],
        // ['alert-weekly', alertWeekly],
        ['scheduled', scheduled],
    ];

    afterEach(async () => {
        await postMessage({ blocks: [createPlainTextSection('=======')] });
    });

    it.each(cases)('Run %p', async (_, service) => {
        return service().then((ok) => {
            expect(ok).toBe(true);
        });
    });
});
