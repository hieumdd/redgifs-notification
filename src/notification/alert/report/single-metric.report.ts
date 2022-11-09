import { protos } from '@google-analytics/data';
import IFilterExpression = protos.google.analytics.data.v1beta.IFilterExpression;

import {
    runReport,
    getDataForDimension,
    getDataForDateRange,
} from '../../../analytics-data/analytics-data.service';
import { TriggerConfig } from '../alert.const';
import { DimensionFilter } from '../../notification.filter';
import { percentageFormatter } from '../../notification.service';
import { Metric } from '../../../analytics-data/metric.enum';
import * as SingleMetric from '../../../analytics-data/metric.const';

type SingleMetricReportOptions = {
    metrics: SingleMetric.SingleMetric[];
    config: typeof TriggerConfig[keyof typeof TriggerConfig];
    filterExpressions?: IFilterExpression[];
};

const singleMetricReport = (options: SingleMetricReportOptions) => {
    const { metrics, config, filterExpressions } = options;

    return async () => {
        const response = await runReport({
            dateRanges: config.dateRanges,
            metrics: metrics.map((metric) => ({ name: metric.key })),
            dimensionFilter: filterExpressions
                ? {
                      andGroup: {
                          expressions: filterExpressions,
                      },
                  }
                : undefined,
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

                // if (figure > -config.threshold) return;

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
    config: TriggerConfig.DAILY,
});

export const dailyGIFViews = singleMetricReport({
    metrics: [{ name: 'GIF Views', key: Metric.EVENT_COUNT }],
    config: TriggerConfig.DAILY,
});

export const dailyLoggedInUsers = singleMetricReport({
    metrics: [{ name: 'Logged In Users', key: Metric.TOTAL_USERS }],
    config: TriggerConfig.DAILY,
    filterExpressions: [DimensionFilter.LOGGED_IN],
});

export const weekly = singleMetricReport({
    metrics: [
        SingleMetric.active7DayUsers,
        SingleMetric.active28DayUsers,
        SingleMetric.totalUsers,
    ],
    config: TriggerConfig.WEEKLY,
});

export const weeklyGIFViews = singleMetricReport({
    metrics: [{ name: 'GIF Views', key: Metric.EVENT_COUNT }],
    config: TriggerConfig.WEEKLY,
});

export const weeklyLoggedInUsers = singleMetricReport({
    metrics: [{ name: 'Logged In Users', key: Metric.TOTAL_USERS }],
    config: TriggerConfig.WEEKLY,
    filterExpressions: [DimensionFilter.LOGGED_IN],
});

export const dailyReddit = singleMetricReport({
    metrics: [SingleMetric.totalUsers],
    config: TriggerConfig.DAILY,
    filterExpressions: [DimensionFilter.REDDIT],
});

export const dailyGIFViewsReddit = singleMetricReport({
    metrics: [{ name: 'GIF Views from Reddit', key: Metric.EVENT_COUNT }],
    config: TriggerConfig.DAILY,
    filterExpressions: [DimensionFilter.REDDIT],
});

export const dailyLoggedInUsersReddit = singleMetricReport({
    metrics: [{ name: 'Logged In Users from Reddit', key: Metric.TOTAL_USERS }],
    config: TriggerConfig.DAILY,
    filterExpressions: [DimensionFilter.REDDIT, DimensionFilter.LOGGED_IN],
});

export const weeklyReddit = singleMetricReport({
    metrics: [SingleMetric.totalUsers],
    config: TriggerConfig.WEEKLY,
    filterExpressions: [DimensionFilter.REDDIT],
});

export const weeklyGIFViewsReddit = singleMetricReport({
    metrics: [{ name: 'GIF Views from Reddit', key: Metric.EVENT_COUNT }],
    config: TriggerConfig.WEEKLY,
    filterExpressions: [DimensionFilter.REDDIT],
});

export const weeklyLoggedInUsersReddit = singleMetricReport({
    metrics: [{ name: 'Logged In Users from Reddit', key: Metric.TOTAL_USERS }],
    config: TriggerConfig.WEEKLY,
    filterExpressions: [DimensionFilter.REDDIT, DimensionFilter.LOGGED_IN],
});
