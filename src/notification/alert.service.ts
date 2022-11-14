import { MetricKey, MetricName, EventKey } from './metric.enum';
import { TODAY, YESTERDAY, THIS_WEEK, LAST_WEEK } from './date-range.const';
import { DateRanges, getReports } from './report.service';
import {
    getTopDimension,
    compareEvent,
    compareMetric,
} from './alert.processor';
import { createPlainTextSection, postMessage } from '../slack/slack.service';

type AlertOptions = {
    dateRanges: DateRanges;
    compareOptions: { threshold: number; suffix: string };
};

export const [alertDaily, alertWeekly] = (() => {
    const options: AlertOptions[] = [
        {
            dateRanges: [TODAY, YESTERDAY],
            compareOptions: { threshold: 0.05, suffix: 'yesterday' },
        },
        {
            dateRanges: [THIS_WEEK, LAST_WEEK],
            compareOptions: { threshold: 0.1, suffix: 'last week' },
        },
    ];

    return options.map(({ dateRanges, compareOptions }) => async () => {
        const responses = await getReports(dateRanges);

        const [active7DayUsers, totalUsers] = [
            {
                name: MetricName.ACTIVE_7_DAY_USERS,
                key: MetricKey.ACTIVE_7_DAY_USERS,
            },
            {
                name: MetricName.TOTAL_USERS,
                key: MetricKey.TOTAL_USERS,
            },
        ].map((metric) =>
            compareMetric(
                responses.singleMetricResponse,
                metric,
                compareOptions,
            ),
        );

        const totalUsersReddit = compareMetric(
            responses.singleMetricRedditResponse,
            {
                name: MetricName.TOTAL_USERS_REDDIT,
                key: MetricKey.TOTAL_USERS,
            },
            compareOptions,
        );

        const [loggedInUsers, loggedInUsersReddit] = [
            compareMetric(
                responses.loggedInUsersResponse,
                {
                    name: MetricName.LOGGED_IN_USERS,
                    key: MetricKey.TOTAL_USERS,
                },
                compareOptions,
            ),
            compareMetric(
                responses.loggedInUsersRedditResponse,
                {
                    name: MetricName.LOGGED_IN_USERS_REDDIT,
                    key: MetricKey.TOTAL_USERS,
                },
                compareOptions,
            ),
        ];

        const [gifViews, gifViewsReddit] = [
            compareEvent(
                responses.eventResponse,
                {
                    name: MetricName.GIF_VIEWS,
                    key: EventKey.GIF_VIEW,
                },
                compareOptions,
            ),
            compareEvent(
                responses.eventRedditResponse,
                {
                    name: MetricName.GIF_VIEWS_REDDIT,
                    key: EventKey.GIF_VIEW,
                },
                compareOptions,
            ),
        ];

        const [topTag, topTagReddit] = [
            getTopDimension(
                responses.topTagResponse,
                { name: MetricName.TOP_TAGS },
                compareOptions,
            ),
            getTopDimension(
                responses.topTagRedditResponse,
                { name: MetricName.TOP_TAGS_REDDIT },
                compareOptions,
            ),
        ];

        const blocks = [
            active7DayUsers,
            totalUsers,
            totalUsersReddit,

            loggedInUsers,
            loggedInUsersReddit,

            gifViews,
            gifViewsReddit,
            
            topTag,
            topTagReddit,
        ].map((text) => createPlainTextSection(text));

        return postMessage({ blocks });
    });
})();
