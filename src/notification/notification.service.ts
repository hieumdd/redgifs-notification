export const numberFormatter = new Intl.NumberFormat('en-us');

export const percentageFormatter = new Intl.NumberFormat('en-us', {
    style: 'percent',
    maximumSignificantDigits: 2,
});
