import { protos } from '@google-analytics/data';
import IFilterExpression = protos.google.analytics.data.v1beta.IFilterExpression;

import {
    runReport,
    getDataForDimension,
    getDataForDateRange,
} from '../../../analytics-data/analytics-data.service';
import { DimensionFilter } from '../../notification.filter';
import { percentageFormatter } from '../../notification.service';
import { scheduledDateRanges } from '../scheduled.const';
import * as SingleMetric from '../../../analytics-data/metric.const';

type SingleMetricReportOptions = {
    dimensionFilter?: IFilterExpression;
};

const singleMetricReport = (options?: SingleMetricReportOptions) => {
    return async () => {
        const metrics = [SingleMetric.totalUsers];
        const response = await runReport({
            dateRanges: scheduledDateRanges,
            metrics: metrics.map((metric) => ({ name: metric.key })),
            dimensionFilter: options?.dimensionFilter,
        });

        return metrics.map((metric) => {
            const data = getDataForDimension(response, metric.key);

            const [today, yesterday, lastWeek] = [0, 1, 2]
                .map((index) => getDataForDateRange(data, index))
                .map((rows) => rows?.pop())
                .map((row) => row?.metricValues?.pop()?.value as string)
                .map((value) => parseInt(value));

            const [todayOverYesterday, todayOverLastWeek] = [
                yesterday,
                lastWeek,
            ]
                .map((figure) => (today - figure) / figure)
                .map((figure) => percentageFormatter.format(figure));

            return `${metric.name} is ${today}, up ${todayOverYesterday} from yesterday and ${todayOverLastWeek} last week`;
        });
    };
};

export const generic = singleMetricReport();

export const reddit = singleMetricReport({
    dimensionFilter: DimensionFilter.REDDIT,
});
