import * as SingleMetric from '../analytics-data/metric.const';
import { createPlainTextSection, postMessage } from '../slack/slack.service';
import { TODAY, YESTERDAY, THIS_WEEK, LAST_WEEK } from './date-range.const';
import { DateRanges, getReports } from './report.service';
import {
    CompareMetricOptions,
    compareDimension,
    compareMetric,
} from './alert.processor';

type AlertOptions = {
    dateRanges: DateRanges;
    compareOptions: CompareMetricOptions;
};

export const [alertDaily, alertWeekly] = (() => {
    const options: AlertOptions[] = [
        {
            dateRanges: [TODAY, YESTERDAY],
            compareOptions: { threshold: 0.05, suffix: 'yesterday' },
        },
        {
            dateRanges: [THIS_WEEK, LAST_WEEK],
            compareOptions: { threshold: 1, suffix: 'last week' },
        },
    ];

    return options.map(({ dateRanges, compareOptions }) => async () => {
        const responses = await getReports(dateRanges);

        const [active7DayUsers, totalUsers] = [
            SingleMetric.active7DayUsers,
            SingleMetric.totalUsers,
        ].map((metric) =>
            compareMetric(
                responses.singleMetricResponse,
                metric,
                compareOptions,
            ),
        );

        const totalUsersReddit = compareMetric(
            responses.singleMetricRedditResponse,
            SingleMetric.totalUsersReddit,
            compareOptions,
        );

        const gifViews = compareMetric(
            responses.gifViewsResponse,
            SingleMetric.gifViews,
            compareOptions,
        );

        const gifViewsReddit = compareMetric(
            responses.gifViewsRedditResponse,
            SingleMetric.gifViewsReddit,
            compareOptions,
        );

        const loggedInUsers = compareMetric(
            responses.tagClickedResponse,
            SingleMetric.loggedInUsers,
            compareOptions,
        );

        const loggedInUsersReddit = compareMetric(
            responses.loggedInUsersRedditResponse,
            SingleMetric.loggedInUsersReddit,
            compareOptions,
        );

        const topTag = compareDimension(
            responses.topTagResponse,
            { name: 'Top Tag' },
            compareOptions,
        );

        const topTagReddit = compareDimension(
            responses.topTagResponse,
            { name: 'Top Tag from Reddit' },
            compareOptions,
        );

        const blocks = [
            active7DayUsers,
            totalUsers,
            totalUsersReddit,
            gifViews,
            gifViewsReddit,
            loggedInUsers,
            loggedInUsersReddit,
            topTag,
            topTagReddit,
        ].map((text) => createPlainTextSection(text));

        return postMessage({ blocks });
    });
})();
