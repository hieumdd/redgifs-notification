import cases from '../common/config.test';
import { patientSessionRepository } from './patient-session.repository';

describe('Build', () => {
    it.each(cases)('$name', async ({ options }) => {
        const query = patientSessionRepository(options).select().toQuery();
        console.log({ query });
        expect(query).toBeTruthy();
    });
});
