import { chain } from 'lodash';
import { protos } from '@google-analytics/data';
import IRunReportResponse = protos.google.analytics.data.v1beta.IRunReportResponse;

import {
    getDataForDateRange,
    getDataForDimension,
    sortDimensionValue,
} from '../../analytics-data/analytics-data.service';
import { SingleMetric } from '../../analytics-data/metric.const';
import { percentageFormatter } from '../notification.service';

export type CompareMetricOptions = { threshold: number; suffix: string };

export const compareMetric = (
    response: IRunReportResponse,
    metricOptions: SingleMetric,
    compareOptions: CompareMetricOptions,
) => {
    const data = getDataForDimension(response, metricOptions.key);

    const [dateRange0, dateRange1] = [0, 1]
        .map((index) => getDataForDateRange(data, index))
        .map((rows) => rows?.pop())
        .map((row) => row?.metricValues?.pop()?.value as string)
        .map((value) => parseInt(value));

    const figure = (dateRange0 - dateRange1) / dateRange1;

    // if (figure > -compareOptions.threshold) return;

    const prettyFigure = percentageFormatter.format(figure);
    return `${metricOptions.name} has gone down by ${prettyFigure} from ${compareOptions.suffix}`;
};

export type CompareDimensionOptions = {
    suffix: string;
};

export const compareDimension = (
    response: IRunReportResponse,
    metricOptions: { name: string },
    compareOptions: CompareDimensionOptions,
) => {
    const [dateRange0, dateRange1] = [0, 1]
        .map((index) => getDataForDateRange(response, index))
        .map((rows) => chain(rows).sortBy(sortDimensionValue).reverse().value())
        .map((rows) => rows.slice(0, 3))
        .map((rows) =>
            rows.map((row) => (row.dimensionValues || [])[0]?.value),
        );

    // if (isEqual(dateRange0, dateRange1)) return [];

    const [dimensions0, dimensions1] = [dateRange0, dateRange1].map(
        (dimensions) => dimensions.join(', '),
    );

    return `${metricOptions.name} are ${dimensions0} as compared to ${dimensions1} ${compareOptions.suffix}`;
};
