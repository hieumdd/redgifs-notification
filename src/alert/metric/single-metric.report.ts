import { protos } from '@google-analytics/data';
import IFilterExpression = protos.google.analytics.data.v1beta.IFilterExpression;

import {
    runReport,
    getDataForDimension,
    getDataForDateRange,
} from '../../analytics-data/analytics-data.service';
import { TriggerConfig, DimensionFilter } from '../alert.const';
import { percentageFormatter } from '../alert.service';
import * as SingleMetric from './single-metric.const';

type SingleMetricReportOptions = {
    metrics: SingleMetric.SingleMetric[];
    threshold: number;
    config: typeof TriggerConfig[keyof typeof TriggerConfig];
    dimensionFilter?: IFilterExpression;
};

const singleMetricReport = (options: SingleMetricReportOptions) => {
    const { metrics, threshold, config, dimensionFilter } = options;

    return async () => {
        const response = await runReport({
            dateRanges: config.dateRanges,
            metrics: metrics.map((metric) => ({ name: metric.key })),
            dimensionFilter,
        });

        return metrics
            .map((metric) => {
                const data = getDataForDimension(response, metric.key);

                const [dateRange0, dateRange1] = [0, 1]
                    .map((index) => getDataForDateRange(data, index))
                    .map((rows) => rows?.pop())
                    .map((row) => row?.metricValues?.pop()?.value as string)
                    .map((value) => parseInt(value));

                const figure = (dateRange0 - dateRange1) / dateRange1;

                if (figure > -threshold) return;

                const prettyFigure = percentageFormatter.format(figure);
                return `${metric.name} has gone down by ${prettyFigure} from ${config.suffix}`;
            })
            .filter((stmt) => !!stmt) as string[];
    };
};

export const daily = singleMetricReport({
    metrics: [
        SingleMetric.active7DayUsers,
        SingleMetric.active28DayUsers,
        SingleMetric.totalUsers,
    ],
    threshold: 0.05,
    config: TriggerConfig.DAILY,
});

export const weekly = singleMetricReport({
    metrics: [
        SingleMetric.active7DayUsers,
        SingleMetric.active28DayUsers,
        SingleMetric.totalUsers,
    ],
    threshold: 0.1,
    config: TriggerConfig.WEEKLY,
});

export const dailyReddit = singleMetricReport({
    metrics: [SingleMetric.totalUsers],
    threshold: 0.05,
    config: TriggerConfig.DAILY,
});

export const weeklyReddit = singleMetricReport({
    metrics: [SingleMetric.totalUsers],
    threshold: 0.05,
    config: TriggerConfig.WEEKLY,
    dimensionFilter: DimensionFilter.REDDIT,
});
