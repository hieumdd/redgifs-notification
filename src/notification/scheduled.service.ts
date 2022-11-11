import * as SingleMetric from '../analytics-data/metric.const';
import { createPlainTextSection, postMessage } from '../slack/slack.service';
import { TODAY, YESTERDAY, THIS_MONTH } from './date-range.const';
import { getReports } from './report.service';
import {
    reportDimension,
    reportMetric,
    reportMetricValue,
    reportMetricDivision,
} from './scheduled.processor';

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

    const [gifViewsPerSessions, gifViewsPerSessionsReddit] = [
        reportMetricDivision(
            reportMetricValue(
                responses.gifViewsResponse,
                SingleMetric.gifViews,
            ),
            reportMetricValue(
                responses.singleMetricResponse,
                SingleMetric.sessions,
            ),
            SingleMetric.gifViewsPerSession,
        ),
        reportMetricDivision(
            reportMetricValue(
                responses.gifViewsRedditResponse,
                SingleMetric.gifViewsReddit,
            ),
            reportMetricValue(
                responses.singleMetricRedditResponse,
                SingleMetric.sessions,
            ),
            SingleMetric.gifViewsPerSessionReddit,
        ),
    ];

    const [loggedInUsers, loggedInUsersReddit] = [
        reportMetric(responses.tagClickedResponse, SingleMetric.loggedInUsers),
        reportMetric(
            responses.loggedInUsersRedditResponse,
            SingleMetric.loggedInUsersReddit,
        ),
    ];

    const [tagClicked, tagClickedReddit] = [
        reportMetric(responses.tagClickedResponse, SingleMetric.tagClicked),
        reportMetric(
            responses.tagClickedResponse,
            SingleMetric.tagClickedReddit,
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
        gifViewsPerSessions,
        gifViewsPerSessionsReddit,
        loggedInUsers,
        loggedInUsersReddit,
        tagClicked,
        tagClickedReddit,
        topTag,
        topTagReddit,
    ].map((text) => createPlainTextSection(text));

    return postMessage({ blocks });
};
