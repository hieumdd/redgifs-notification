import { chain } from 'lodash';
import { protos } from '@google-analytics/data';
import IRunReportResponse = protos.google.analytics.data.v1beta.IRunReportResponse;

import {
    getDataForDateRange,
    getDataForDimension,
    sortDimensionValue,
} from '../analytics-data/analytics-data.service';
import { percentageFormatter } from './notification.service';

type CompareMetricOptions = {
    name: string;
    key: string;
};

export const [compareMetricDoD, compareMetricWoW] = (() => {
    return [
        [[0, 1], 0.05, 'yesterday'],
        [[2, 3], 0.1, 'last week'],
    ].map(([dateRanges, threshold, suffix]) => {
        return (
            response: IRunReportResponse,
            options: CompareMetricOptions,
        ) => {
            const data = getDataForDimension(response, options.key);

            const [dateRange0, dateRange1] = (dateRanges as [number, number])
                .map((index) => getDataForDateRange(data, index))
                .map((rows) => rows?.pop())
                .map((row) => row?.metricValues?.pop()?.value as string)
                .map((value) => parseInt(value));

            const figure = (dateRange0 - dateRange1) / dateRange1;

            // if (figure > -threshold) return;

            const prettyFigure = percentageFormatter.format(figure);
            return `${options.name} has gone down by ${prettyFigure} from ${suffix}`;
        };
    });
})();

type CompareDimensionOptions = {
    name: string;
};

export const [compareDimensionDoD, compareDimensionWoW] = (() => {
    return [
        [[0, 1], 'yesterday'],
        [[2, 3], 'last week'],
    ].map(([dateRanges, suffix]) => {
        return (
            response: IRunReportResponse,
            options: CompareDimensionOptions,
        ) => {
            const [dateRange0, dateRange1] = (dateRanges as [number, number])
                .map((index) => getDataForDateRange(response, index))
                .map((rows) =>
                    chain(rows).sortBy(sortDimensionValue).reverse().value(),
                )
                .map((rows) => rows.slice(0, 3))
                .map((rows) =>
                    rows.map((row) => (row.dimensionValues || [])[0]?.value),
                );

            // if (isEqual(dateRange0, dateRange1)) return [];

            const [dimensions0, dimensions1] = [dateRange0, dateRange1].map(
                (dimensions) => dimensions.join(', '),
            );

            return `${options.name} are ${dimensions0} as compared to ${dimensions1} ${suffix}`;
        };
    });
})();
