import { BetaAnalyticsDataClient, protos } from '@google-analytics/data';
import IRunReportRequest = protos.google.analytics.data.v1beta.IRunReportRequest;
import IRunReportResponse = protos.google.analytics.data.v1beta.IRunReportResponse;
import IRow = protos.google.analytics.data.v1beta.IRow;

export const client = new BetaAnalyticsDataClient();

export const PROPERTY_ID = '272551827';

export const runReport = (request: IRunReportRequest) =>
    client
        .runReport({
            property: `properties/${PROPERTY_ID}`,
            returnPropertyQuota: true,
            ...request,
        })
        .then(([response]) => {
            console.log(
                'quota',
                response.propertyQuota?.tokensPerProjectPerHour,
            );
            return response;
        });

export const getDataForMetric = (
    response: IRunReportResponse,
    metric: string,
) => {
    const index = response.metricHeaders?.findIndex(
        (header) => header.name === metric,
    ) as number;

    const rows = response.rows?.map((row) => {
        const metricValues = row.metricValues?.filter((_, i) => i === index);
        return { ...row, metricValues };
    });

    return { ...response, rows };
};

export const getDataForDateRange = (
    response: IRunReportResponse,
    index: number,
) => {
    const dateRangeValue = `date_range_${index}`;

    return response.rows?.filter((row) =>
        row.dimensionValues?.find(
            (dimensionValue) => dimensionValue.value === dateRangeValue,
        ),
    );
};

export const getDataForDimension = (
    response: IRunReportResponse,
    dimension: string,
) => {
    const rows = response.rows?.filter((row) => {
        const x = row.dimensionValues?.map((value) => value.value);
        return row.dimensionValues
            ?.map((value) => value.value)
            .includes(dimension);
    });
    return { ...response, rows };
};

export const sortDimensionValue = ({ metricValues }: IRow) => {
    const value = [...(metricValues || [])].pop()?.value;
    return parseInt(value || '0');
};
