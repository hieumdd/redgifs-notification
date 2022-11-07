import { getService } from '../common/service';
import { patientSessionRepository } from './patient-session.repository';

export const getAll = getService((options) => {
    const { count, page } = options;

    return patientSessionRepository(options)
        .limit(count)
        .offset(count * page);
});

export const getCount = getService((options) => {
    return patientSessionRepository(options).count({ COUNT: '*' });
});
