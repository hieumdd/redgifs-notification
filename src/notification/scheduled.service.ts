import * as SingleMetric from '../analytics-data/metric.const';
import { createPlainTextSection, postMessage } from '../slack/slack.service';
import { TODAY, YESTERDAY, THIS_MONTH } from './date-range.const';
import { getReports } from './report.service';
import { reportDimension, reportMetric } from './scheduled.processor';

export const scheduled = async () => {
    const dateRanges = [TODAY, YESTERDAY, THIS_MONTH];

    const responses = await getReports(dateRanges);

    const [totalUsers, pageViews, sessionDuration] = [
        SingleMetric.totalUsers,
        SingleMetric.pageViews,
        SingleMetric.sessionDuration,
    ].map((metric) => reportMetric(responses.singleMetricResponse, metric));

    const [totalUsersReddit, pageViewsReddit, sessionDurationReddit] = [
        SingleMetric.totalUsersReddit,
        SingleMetric.pageViewsReddit,
        SingleMetric.sessionDurationReddit,
    ].map((metric) =>
        reportMetric(responses.singleMetricRedditResponse, metric),
    );

    const [gifViews, gifViewsReddit] = [
        reportMetric(responses.gifViewsResponse, SingleMetric.gifViews),
        reportMetric(
            responses.gifViewsRedditResponse,
            SingleMetric.gifViewsReddit,
        ),
    ];

    const [loggedInUsers, loggedInUsersReddit] = [
        reportMetric(
            responses.loggedInUsersResponse,
            SingleMetric.loggedInUsers,
        ),
        reportMetric(
            responses.loggedInUsersRedditResponse,
            SingleMetric.loggedInUsersReddit,
        ),
    ];

    const [topTag, topTagReddit] = [
        reportDimension(responses.topTagResponse, { name: 'Top Tags' }),
        reportDimension(responses.topTagRedditResponse, {
            name: 'Top Tags from Reddit',
        }),
    ];

    const blocks = [
        totalUsers,
        totalUsersReddit,
        pageViews,
        pageViewsReddit,
        sessionDuration,
        sessionDurationReddit,
        gifViews,
        gifViewsReddit,

        loggedInUsers,
        loggedInUsersReddit,

        topTag,
        topTagReddit,
    ].map((text) => createPlainTextSection(text));

    return postMessage({ blocks });
};
