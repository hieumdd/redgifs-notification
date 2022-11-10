import { chain } from 'lodash';
import { protos } from '@google-analytics/data';
import IRunReportResponse = protos.google.analytics.data.v1beta.IRunReportResponse;

import {
    getDataForDateRange,
    getDataForDimension,
    sortDimensionValue,
} from '../analytics-data/analytics-data.service';
import { SingleMetric } from '../analytics-data/metric.const';
import { percentageFormatter } from './notification.service';

export const reportMetric = (
    response: IRunReportResponse,
    metricOptions: SingleMetric,
) => {
    const data = getDataForDimension(response, metricOptions.key);

    const [today, yesterday, thisMonth] = [0, 1, 2]
        .map((index) => getDataForDateRange(data, index))
        .map((rows) => rows?.pop())
        .map((row) => row?.metricValues?.pop()?.value as string)
        .map((value) => parseInt(value))
        .map((value, i) => (i === 2 ? value / 28 : value));

    const [todayOverYesterday, todayOverLastWeek] = [yesterday, thisMonth]
        .map((figure) => (today - figure) / figure)
        .map((figure) => percentageFormatter.format(figure));

    return `${metricOptions.name} is ${today}, up ${todayOverYesterday} from yesterday and ${todayOverLastWeek} last week`;
};

export const reportMetricDivision = (
    response: IRunReportResponse,
    metricOptions: SingleMetric,
    metrics: [SingleMetric, SingleMetric],
) => {
    const [[today0, yesterday0, thisMonth0], [today1, yesterday1, thisMonth1]] =
        metrics.map((metricOption) => {
            const data = getDataForDimension(response, metricOption.key);

            return [0, 1, 2]
                .map((index) => getDataForDateRange(data, index))
                .map((rows) => rows?.pop())
                .map((row) => row?.metricValues?.pop()?.value as string)
                .map((value) => parseInt(value))
                .map((value, i) => (i === 2 ? value / 28 : value));
        });

    const [today, yesterday, thisMonth] = [
        today0 / today1,
        yesterday0 / yesterday1,
        thisMonth0 / thisMonth1,
    ];

    const [todayOverYesterday, todayOverThisMonth] = [yesterday, thisMonth]
        .map((figure) => (today - figure) / figure)
        .map((figure) => percentageFormatter.format(figure));

    return `${metricOptions.name} is ${today}, up ${todayOverYesterday} from yesterday and ${todayOverThisMonth} last week`;
};

export const reportDimension = (
    { rows }: IRunReportResponse,
    { name }: { name: string },
) => {
    const dimensions = chain(rows)
        .sortBy(sortDimensionValue)
        .reverse()
        .value()
        .slice(1, 4)
        .map((row) => [
            (row.dimensionValues || [])[0]?.value,
            (row.metricValues || [])[0].value,
        ])
        .map(([key, value]) => `${key} (${value})`)
        .join(', ');

    return `${name} are ${dimensions}`;
};
