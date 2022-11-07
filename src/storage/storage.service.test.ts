import { createExportCSV } from './storage.service';

it('Download Link', () => {
    const file = createExportCSV();
    const url = file.publicUrl();

    console.log(url)
    return expect(url).toBeTruthy();
});
