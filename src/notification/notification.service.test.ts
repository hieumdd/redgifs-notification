import * as AlertService from './alert/alert.service';
import * as ScheduledService from './scheduled/scheduled.service';
import { notificationService } from './notification.service';

describe('Notification Service', () => {
    const cases: [string, (() => Promise<any>)[]][] = [
        ['alert-daily', AlertService.daily],
        ['alert-weekly', AlertService.weekly],
        ['scheduled', ScheduledService.scheduleds],
    ];

    it.each(cases)('Alert %p', async (_, services) => {
        return notificationService(services).then((response) => {
            expect(response.ok).toBe(true);
        });
    });
});
