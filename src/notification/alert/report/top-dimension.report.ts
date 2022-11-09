import { chain, isEqual } from 'lodash';
import { protos } from '@google-analytics/data';
import IFilterExpression = protos.google.analytics.data.v1beta.IFilterExpression;

import {
    runReport,
    getDataForDateRange,
    sortDimensionValue,
} from '../../../analytics-data/analytics-data.service';
import { Metric } from '../../../analytics-data/metric.enum';
import { TriggerConfig } from '../alert.const';
import { DimensionFilter } from '../../notification.filter';

type TopDimensionReportOptions = {
    name: string;
    config: typeof TriggerConfig[keyof typeof TriggerConfig];
    dimensionFilter?: IFilterExpression;
};

const topDimensionReport = (options: TopDimensionReportOptions) => {
    const { name, config, dimensionFilter } = options;

    return async () => {
        const response = await runReport({
            dateRanges: config.dateRanges,
            dimensions: [{ name: 'customEvent:tag_name' }],
            metrics: [{ name: Metric.EVENT_COUNT }],
            dimensionFilter,
        });

        const [dateRange0, dateRange1] = [0, 1]
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

        return [
            `${name} are ${dimensions0} as compared to ${dimensions1} ${config.suffix}`,
        ];
    };
};

export const daily = topDimensionReport({
    name: 'Top 3 tags',
    config: TriggerConfig.DAILY,
});

export const weekly = topDimensionReport({
    name: 'Top 3 tags',
    config: TriggerConfig.WEEKLY,
});

export const dailyReddit = topDimensionReport({
    name: 'Top 3 tags from Reddit',
    config: TriggerConfig.DAILY,
    dimensionFilter: DimensionFilter.REDDIT,
});

export const weeklyReddit = topDimensionReport({
    name: 'Top 3 tags from Reddit',
    config: TriggerConfig.WEEKLY,
    dimensionFilter: DimensionFilter.REDDIT,
});
