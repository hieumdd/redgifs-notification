import * as SingleMetric from './metric/single-metric.report';
import * as TopDimension from './metric/top-dimension.report';
import { createPlainTextSection, postMessage } from '../slack/slack.service';

export const percentageFormatter = new Intl.NumberFormat('en-us', {
    style: 'percent',
    maximumSignificantDigits: 2,
});

type AlertOptions = {
    reports: (() => Promise<string[]>)[];
};

export const alertService = (options: AlertOptions) => async () => {
    return Promise.all(options.reports.map((report) => report()))
        .then((alertArrs) => alertArrs.flat())
        .then((alerts) => alerts.map((alert) => createPlainTextSection(alert)))
        .then((blocks) => postMessage({ blocks }));
};

export const daily = alertService({
    reports: [SingleMetric.daily, TopDimension.daily, TopDimension.dailyReddit],
});

export const weekly = alertService({
    reports: [SingleMetric.weeklyReddit],
});
