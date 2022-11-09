import { WebClient, ChatPostMessageArguments } from '@slack/web-api';

const client = new WebClient(process.env.SLACK_TOKEN);

const channel = 'C04AGMYPH3K';

export const createPlainTextSection = (text: string) => ({
    type: 'section',
    text: { text, type: 'plain_text' },
});

export const postMessage = (
    options: Omit<ChatPostMessageArguments, 'channel'>,
) =>
    client.chat.postMessage({
        ...options,
        text: 'redgifs-notification',
        channel,
    });
