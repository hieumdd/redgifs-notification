import { chain } from 'lodash';
import { protos } from '@google-analytics/data';
import IRunReportResponse = protos.google.analytics.data.v1beta.IRunReportResponse;

import {
    getDataForDateRange,
    getDataForDimension,
    getDataForMetric,
    sortDimensionValue,
} from '../analytics-data/analytics-data.service';
import { percentageFormatter } from './notification.service';
import { MetricOptions } from './notification.interface';

export const [compareEvent, compareMetric] = [
    getDataForDimension,
    getDataForMetric,
].map((parse) => {
    return (
        response: IRunReportResponse,
        metricOptions: MetricOptions,
        compareOptions: { threshold: number; suffix: string },
    ) => {
        const data = parse(response, metricOptions.key);

        const [dateRange0, dateRange1] = [0, 1]
            .map((index) => getDataForDateRange(data, index))
            .map((rows) => [...(rows || [])].pop())
            .map((row) => [...(row?.metricValues || [])].pop()?.value as string)
            .map((value) => parseInt(value));

        const figure = (dateRange0 - dateRange1) / dateRange1;

        // if (figure > -compareOptions.threshold) return;

        const prettyFigure = percentageFormatter.format(figure);
        return `${metricOptions.name} has gone down by ${prettyFigure} from ${compareOptions.suffix}`;
    };
});

export const getTopDimension = (
    response: IRunReportResponse,
    metricOptions: Pick<MetricOptions, 'name'>,
    compareOptions: { suffix: string },
) => {
    const [dateRange0, dateRange1] = [0, 1]
        .map((index) => getDataForDateRange(response, index))
        .map((rows) => chain(rows).sortBy(sortDimensionValue).reverse().value())
        .map((rows) => rows.slice(1, 4))
        .map((rows) =>
            rows.map((row) => [...(row.dimensionValues || [])].pop()?.value),
        );

    // if (isEqual(dateRange0, dateRange1)) return [];

    const [dimensions0, dimensions1] = [dateRange0, dateRange1].map(
        (dimensions) => dimensions.join(', '),
    );

    return `${metricOptions.name} are ${dimensions0} as compared to ${dimensions1} ${compareOptions.suffix}`;
};
