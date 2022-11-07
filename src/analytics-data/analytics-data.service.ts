import { chain } from 'lodash';
import { protos } from '@google-analytics/data';
import RunReportResponse = protos.google.analytics.data.v1beta.IRunReportResponse;
import IRow = protos.google.analytics.data.v1beta.IRow;

export const getDataForDateRange = (
    response: RunReportResponse,
    index: number,
) => {
    const dateRangeValue = `date_range_${index}`;

    return response.rows?.filter((row) =>
        row.dimensionValues?.find(
            (dimensionValue) => dimensionValue.value === dateRangeValue,
        ),
    );
};

type Processor = (res: RunReportResponse, thresh: number) => number | undefined;

export const processSingleMetric: Processor = (response, threshold) => {
    const [dateRange0, dateRange1] = [0, 1]
        .map((index) => getDataForDateRange(response, index))
        .map((rows) => rows?.pop())
        .map((row) => row?.metricValues?.pop()?.value as string)
        .map((value) => parseInt(value));

    const figure = (dateRange0 - dateRange1) / dateRange1;

    return figure < -threshold ? figure : undefined;
};

export const processTopDimension: Processor = (response) => {
    const [dateRange0, dateRange1] = [0, 1]
        .map((index) => getDataForDateRange(response, index))
        .map((rows) => {
            const sortFn = ({ metricValues }: IRow) => {
                const value = [...(metricValues || [])].pop()?.value;
                return parseInt(value || '0');
            };
            return chain(rows).sortBy(sortFn).reverse().value();
        })
        .map((rows) => rows.slice(0, 3))
        .map((rows) => rows.map((row) => (row.dimensionValues || [])[0]?.value));

    return 1;
};
