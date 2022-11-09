import { BetaAnalyticsDataClient, protos } from '@google-analytics/data';
import IRunReportRequest = protos.google.analytics.data.v1beta.IRunReportRequest;
import RunReportResponse = protos.google.analytics.data.v1beta.IRunReportResponse;
import IRow = protos.google.analytics.data.v1beta.IRow;

export const client = new BetaAnalyticsDataClient();

export const PROPERTY_ID = '272551827';

export const runReport = (request: IRunReportRequest) =>
    client
        .runReport({
            property: `properties/${PROPERTY_ID}`,
            ...request,
        })
        .then(([response]) => response);

export const getDataForDimension = (
    response: RunReportResponse,
    dimension: string,
) => {
    const index = response.metricHeaders?.findIndex(
        (header) => header.name === dimension,
    ) as number;

    const rows = response.rows?.map((row) => {
        const metricValues = row.metricValues?.filter((_, i) => i === index);
        return { ...row, metricValues };
    });

    return { ...response, rows };
};

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

export const sortDimensionValue = ({ metricValues }: IRow) => {
    const value = [...(metricValues || [])].pop()?.value;
    return parseInt(value || '0');
};
