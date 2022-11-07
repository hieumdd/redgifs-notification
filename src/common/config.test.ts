import { QueryOptions } from './service';

const page = { count: 10, page: 0 };
const time = { start: '2021-07-01', end: '2022-07-01' };
const patientName = { patientName: 'LAIRD  NANCY' };
const compliant = { complaint: true };
const therapyModeGroup = { therapyModeGroup: 'CPAP' };
const over65 = { over65: true };

const cases: { name: string; options: QueryOptions }[] = [
    { name: 'Query', options: { ...page } },
    { name: 'Query w/ Date', options: { ...page, ...time } },
    {
        name: 'Query w/ All',
        options: {
            ...page,
            ...time,
            ...patientName,
            ...compliant,
            ...therapyModeGroup,
            ...over65,
        },
    },
    { name: 'Query w/ Patient Name', options: { ...page, ...patientName } },
];

export default cases;
