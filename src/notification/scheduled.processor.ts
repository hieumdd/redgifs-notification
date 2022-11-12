import { cloneDeep } from 'lodash';
import { protos } from '@google-analytics/data';
import IRunReportResponse = protos.google.analytics.data.v1beta.IRunReportResponse;

import {
    getDataForDateRange,
    getDataForDimension,
    getDataForMetric,
} from '../analytics-data/analytics-data.service';
import { percentageFormatter } from './notification.service';
import { MetricKey } from '../analytics-data/metric.enum';
import { MetricOptions } from './notification.interface';

export const reportMetricValue = (
    response: IRunReportResponse,
    metricOptions: MetricOptions,
) => {
    const data = cloneDeep(getDataForMetric(response, metricOptions.key));

    return [0, 1, 2]
        .map((index) => getDataForDateRange(data, index))
        .map((rows) => rows?.pop())
        .map((row) => row?.metricValues?.pop()?.value as string)
        .map((value) => parseInt(value))
        .map((value, i) =>
            i === 2 && metricOptions.key !== MetricKey.AVERAGE_SESSION_DURATION
                ? value / 28
                : value,
        ) as [number, number, number];
};

const createMetricStatement = (
    figures: [number, number, number],
    metricOptions: MetricOptions,
) => {
    const [today, yesterday, thisMonth] = figures;

    const [todayOverYesterday, todayOverLastWeek] = [yesterday, thisMonth]
        .map((figure) => (today - figure) / figure)
        .map((figure) => percentageFormatter.format(figure));

    return `${metricOptions.name} is ${today}, up ${todayOverYesterday} from yesterday and ${todayOverLastWeek} last week`;
};

export const reportMetric = (
    response: IRunReportResponse,
    metricOptions: MetricOptions,
) => {
    const figures = reportMetricValue(response, metricOptions);

    return createMetricStatement(figures, metricOptions);
};

export const reportMetricDivision = (
    numerators: [number, number, number],
    denominators: [number, number, number],
    metricOptions: MetricOptions,
) => {
    const [today0, yesterday0, thisMonth0] = numerators;
    const [today1, yesterday1, thisMonth1] = denominators;

    const figures = [
        today0 / today1,
        yesterday0 / yesterday1,
        thisMonth0 / thisMonth1,
    ] as [number, number, number];

    return createMetricStatement(figures, metricOptions);
};

export const reportEventValue = (
    response: IRunReportResponse,
    eventOptions: MetricOptions,
) => {
    const data = cloneDeep(getDataForDimension(response, eventOptions.key));

    return [0, 1, 2]
        .map((index) => getDataForDateRange(data, index))
        .map((rows) => rows?.pop())
        .map((row) => row?.metricValues?.pop()?.value as string)
        .map((value) => parseInt(value)) as [number, number, number];
};

export const reportEvent = (
    response: IRunReportResponse,
    eventOptions: MetricOptions,
) => {
    const figures = reportEventValue(response, eventOptions);

    return createMetricStatement(figures, eventOptions);
};

export const reportDimension = (
    response: IRunReportResponse,
    { name }: Pick<MetricOptions, 'name'>,
) => {
    const rows = getDataForDateRange(response, 0);

    const dimensions = (rows || [])
        .slice(1, 4)
        .map((row) => [
            (row.dimensionValues || [])[0]?.value,
            (row.metricValues || [])[0].value,
        ])
        .map(([key, value]) => `${key} (${value})`)
        .join(', ');

    return `${name} are ${dimensions}`;
};
