import { isEqual } from 'lodash';
import { protos } from '@google-analytics/data';
import IFilterExpression = protos.google.analytics.data.v1beta.IFilterExpression;

import {
    runReport,
    getDataForDateRange,
} from '../../../analytics-data/analytics-data.service';
import { Metric } from '../../../analytics-data/metric.enum';
import { TriggerConfig } from '../alert.const';
import { DimensionFilter } from '../../notification.filter';
import { percentageFormatter } from '../../notification.service';

type GIFViewsReportOptions = {
    name: string;
    threshold: number;
    config: typeof TriggerConfig[keyof typeof TriggerConfig];
    filterExpressions?: IFilterExpression[];
};

const gifViewsReport = (options: GIFViewsReportOptions) => {
    const { name, threshold, config, filterExpressions } = options;

    return async () => {
        const response = await runReport({
            dateRanges: config.dateRanges,
            metrics: [{ name: Metric.EVENT_COUNT }],
            dimensionFilter: {
                andGroup: {
                    expressions: [
                        DimensionFilter.GIF_VIEW,
                        ...(filterExpressions || []),
                    ],
                },
            },
        });

        const [dateRange0, dateRange1] = [0, 1]
            .map((index) => getDataForDateRange(response, index))
            .map((rows) => rows?.pop())
            .map((row) => row?.metricValues?.pop()?.value as string)
            .map((value) => parseInt(value));

        const figure = (dateRange0 - dateRange1) / dateRange1;

        // if (figure > -threshold) return;

        const prettyFigure = percentageFormatter.format(figure);
        return [
            `${name} has gone down by ${prettyFigure} from ${config.suffix}`,
        ];
    };
};

export const daily = gifViewsReport({
    name: 'GIF Views',
    threshold: 0.05,
    config: TriggerConfig.DAILY,
});

export const weekly = gifViewsReport({
    name: 'GIF Views',
    threshold: 0.05,
    config: TriggerConfig.WEEKLY,
});

export const dailyReddit = gifViewsReport({
    name: 'GIF Views Reddit',
    threshold: 0.1,
    config: TriggerConfig.DAILY,
    filterExpressions: [DimensionFilter.REDDIT],
});

export const weeklyReddit = gifViewsReport({
    name: 'GIF Views',
    threshold: 0.1,
    config: TriggerConfig.WEEKLY,
    filterExpressions: [DimensionFilter.REDDIT],
});
