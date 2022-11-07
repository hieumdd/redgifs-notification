import { v4 as uuidv4 } from 'uuid';
import { Storage } from '@google-cloud/storage';

const client = new Storage();

export const createExportCSV = () =>
    client.bucket('genadyne-exports').file(`${uuidv4()}.csv`);
