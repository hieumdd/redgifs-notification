import { getService } from '../common/service';
import { compliantRepository } from './compliance.repository';

export const getAll = getService((options) => {
    const { count, page } = options;

    return compliantRepository(options)
        .limit(count)
        .offset(count * page);
});

export const getCount = getService((options) => {
    return compliantRepository(options).count({ COUNT: '*' });
});
