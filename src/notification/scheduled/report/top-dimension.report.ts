import { chain } from 'lodash';
import { protos } from '@google-analytics/data';
import IFilterExpression = protos.google.analytics.data.v1beta.IFilterExpression;

import {
    runReport,
    sortDimensionValue,
} from '../../../analytics-data/analytics-data.service';
import { scheduledDateRanges } from '../scheduled.const';
import { DimensionFilter } from '../../notification.filter';

type TopDimensionReportOptions = {
    name: string;
    dimensionFilter?: IFilterExpression;
};

const topDimensionReport = (options: TopDimensionReportOptions) => {
    return async () => {
        const response = await runReport({
            dateRanges: [scheduledDateRanges[0]],
            dimensions: [{ name: 'customEvent:tag_name' }],
            metrics: [{ name: 'eventCount' }],
            dimensionFilter: options.dimensionFilter,
        });

        const { rows } = response;

        const dimensions = chain(rows)
            .sortBy(sortDimensionValue)
            .reverse()
            .value()
            .slice(0, 3)
            .map((row) => [
                (row.dimensionValues || [])[0]?.value,
                (row.metricValues || [])[0].value,
            ])
            .map(([key, value]) => `${key} (${value})`)
            .join(', ');

        return [`${options.name} are ${dimensions}`];
    };
};

export const generic = topDimensionReport({
    name: 'Top Tags',
});

export const reddit = topDimensionReport({
    name: 'Top Tags from Reddit',
    dimensionFilter: DimensionFilter.REDDIT,
});
