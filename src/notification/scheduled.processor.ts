import { protos } from '@google-analytics/data';
import IRunReportResponse = protos.google.analytics.data.v1beta.IRunReportResponse;

import {
    getDataForDateRange,
    getDataForDimension,
    getDataForMetric,
} from '../analytics-data/analytics-data.service';
import { numberFormatter, percentageFormatter } from './notification.service';
import { MetricKey } from './metric.enum';
import { MetricOptions } from './interface';

type SingleMetricValue = [number, number, number];

export const [reportEventValue, reportMetricValue] = [
    getDataForDimension,
    getDataForMetric,
].map((parse) => {
    return (response: IRunReportResponse, metricOptions: MetricOptions) => {
        const data = parse(response, metricOptions.key);

        return [0, 1, 2]
            .map((index) => getDataForDateRange(data, index))
            .map((rows) => [...(rows || [])].pop())
            .map((row) => [...(row?.metricValues || [])].pop()?.value as string)
            .map((value) => parseInt(value))
            .map((value, i) =>
                i === 2 &&
                metricOptions.key !== MetricKey.AVERAGE_SESSION_DURATION
                    ? value / 28
                    : value,
            ) as SingleMetricValue;
    };
});

const createMetricStatement = (
    figures: SingleMetricValue,
    metricOptions: MetricOptions,
) => {
    const [today, yesterday, thisMonth] = figures;

    const [todayOverYesterday, todayOverLastWeek] = [yesterday, thisMonth]
        .map((figure) => (today - figure) / figure)
        .map((figure) => percentageFormatter.format(figure));

    const prettyToday = numberFormatter.format(today);

    return `${metricOptions.name} is ${prettyToday}, ${todayOverYesterday} from yesterday and ${todayOverLastWeek} last week`;
};

export const [reportEvent, reportMetric] = [
    reportEventValue,
    reportMetricValue,
].map((report) => {
    return (response: IRunReportResponse, metricOptions: MetricOptions) => {
        const figures = report(response, metricOptions);

        return createMetricStatement(figures, metricOptions);
    };
});

export const reportDivision = (
    numerators: SingleMetricValue,
    denominators: SingleMetricValue,
    metricOptions: MetricOptions,
) => {
    const [today0, yesterday0, thisMonth0] = numerators;
    const [today1, yesterday1, thisMonth1] = denominators;

    const figures = [
        today0 / today1,
        yesterday0 / yesterday1,
        thisMonth0 / thisMonth1,
    ] as SingleMetricValue;

    return createMetricStatement(figures, metricOptions);
};

export const reportTopDimension = (
    response: IRunReportResponse,
    { name }: Pick<MetricOptions, 'name'>,
) => {
    const rows = getDataForDateRange(response, 0);

    const dimensions = (rows || [])
        .slice(1, 4)
        .map((row) => [
            (row.dimensionValues || [])[0].value,
            [...(row.metricValues || [])].pop()?.value,
        ])
        .map(
            ([key, value]) =>
                `${key} (${numberFormatter.format(parseFloat(value || '0'))})`,
        )
        .join(', ');

    return `${name} are ${dimensions}`;
};
