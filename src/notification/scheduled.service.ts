import { MetricKey, MetricName, EventKey } from '../analytics-data/metric.enum';
import { TODAY, YESTERDAY, THIS_MONTH } from './date-range.const';
import { getReports } from './report.service';
import {
    reportDimension,
    reportMetric,
    reportMetricValue,
    reportMetricDivision,
    reportEvent,
    reportEventValue,
} from './scheduled.processor';
import { createPlainTextSection, postMessage } from '../slack/slack.service';

export const scheduled = async () => {
    const dateRanges = [TODAY, YESTERDAY, THIS_MONTH];

    const responses = await getReports(dateRanges);

    const [totalUsers, pageViews, sessionDuration] = [
        {
            name: MetricName.TOTAL_USERS,
            key: MetricKey.TOTAL_USERS,
        },
        {
            name: MetricName.PAGE_VIEWS,
            key: MetricKey.SCREEN_PAGE_VIEWS,
        },
        {
            name: MetricName.SESSION_DURATION,
            key: MetricKey.AVERAGE_SESSION_DURATION,
        },
    ].map((metric) => reportMetric(responses.singleMetricResponse, metric));

    const [totalUsersReddit, pageViewsReddit, sessionDurationReddit] = [
        {
            name: MetricName.TOTAL_USERS_REDDIT,
            key: MetricKey.TOTAL_USERS,
        },
        {
            name: MetricName.PAGE_VIEWS_REDDIT,
            key: MetricKey.SCREEN_PAGE_VIEWS,
        },
        {
            name: MetricName.SESSION_DURATION_REDDIT,
            key: MetricKey.AVERAGE_SESSION_DURATION,
        },
    ].map((metric) =>
        reportMetric(responses.singleMetricRedditResponse, metric),
    );

    const [loggedInUsers, loggedInUsersReddit] = [
        reportMetric(responses.loggedInUsersResponse, {
            name: MetricName.LOGGED_IN_USERS,
            key: MetricKey.TOTAL_USERS,
        }),
        reportMetric(responses.loggedInUsersRedditResponse, {
            name: MetricName.LOGGED_IN_USERS_REDDIT,
            key: MetricKey.TOTAL_USERS,
        }),
    ];

    const [gifViews, gifViewsReddit] = [
        reportEvent(responses.eventResponse, {
            name: MetricName.GIF_VIEWS,
            key: EventKey.GIF_VIEW,
        }),
        reportEvent(responses.eventRedditResponse, {
            name: MetricName.GIF_VIEWS_REDDIT,
            key: EventKey.GIF_VIEW,
        }),
    ];

    const [gifViewsPerSessions, gifViewsPerSessionsReddit] = [
        reportMetricDivision(
            reportEventValue(responses.eventResponse, {
                name: MetricName.GIF_VIEWS,
                key: EventKey.GIF_VIEW,
            }),
            reportMetricValue(responses.singleMetricResponse, {
                name: MetricName.SESSIONS,
                key: MetricKey.SESSIONS,
            }),
            {
                name: MetricName.GIF_VIEWS_PER_SESSION,
                key: EventKey.GIF_VIEW,
            },
        ),
        reportMetricDivision(
            reportEventValue(responses.eventRedditResponse, {
                name: MetricName.GIF_VIEWS,
                key: EventKey.GIF_VIEW,
            }),
            reportMetricValue(responses.singleMetricRedditResponse, {
                name: MetricName.SESSIONS,
                key: MetricKey.SESSIONS,
            }),
            {
                name: MetricName.GIF_VIEWS_PER_SESSION_REDDIT,
                key: EventKey.GIF_VIEW,
            },
        ),
    ];

    const [tagClickeds, tagClickedsReddit] = [
        reportEvent(responses.eventResponse, {
            name: MetricName.TAG_CLICKEDS,
            key: EventKey.TAG_CLICKED,
        }),
        reportEvent(responses.eventRedditResponse, {
            name: MetricName.TAG_CLICKEDS_REDDIT,
            key: EventKey.TAG_CLICKED,
        }),
    ];

    const [topTag, topTagReddit] = [
        reportDimension(responses.topTagResponse, {
            name: MetricName.TOP_TAGS,
        }),
        reportDimension(responses.topTagRedditResponse, {
            name: MetricName.TOP_TAGS_REDDIT,
        }),
    ];

    const blocks = [
        totalUsers,
        totalUsersReddit,
        pageViews,
        pageViewsReddit,
        sessionDuration,
        sessionDurationReddit,
        loggedInUsers,
        loggedInUsersReddit,
        gifViews,
        gifViewsReddit,
        gifViewsPerSessions,
        gifViewsPerSessionsReddit,
        tagClickeds,
        tagClickedsReddit,
        topTag,
        topTagReddit,
    ].map((text) => createPlainTextSection(text));

    return postMessage({ blocks });
};
