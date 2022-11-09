import { createPlainTextSection, postMessage } from '../slack/slack.service';

export const percentageFormatter = new Intl.NumberFormat('en-us', {
    style: 'percent',
    maximumSignificantDigits: 2,
});

type Options = (() => Promise<string[]>)[];

export const notificationService = async (reports: Options) =>
    Promise.all(reports.map((report) => report()))
        .then((textArrs) => textArrs.flat())
        .then((texts) => texts.map((text) => createPlainTextSection(text)))
        .then((blocks) => postMessage({ blocks }));
