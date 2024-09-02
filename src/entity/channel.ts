export type Channel = {
    channel_name: string;
    source_type?: string;
    channel_id: number;
    is_sub: boolean;
    limit?: number;
};

export type ChannelAsSearchParams = {
    channel_name: string;
    source_type?: string;
    channel_id: string;
    is_sub: string;
}

export const intoSearchParams = (channel: Channel): ChannelAsSearchParams => {
    return {
        channel_name: channel.channel_name,
        source_type: channel.source_type,
        channel_id: channel.channel_id.toString(),
        is_sub: (+channel.is_sub).toString(),
    }
}

export const intoChannel = (channelSearchParams: ChannelAsSearchParams): Channel => {
    return {
        channel_name: channelSearchParams.channel_name,
        source_type: channelSearchParams.source_type || "",
        channel_id: Number.parseInt(channelSearchParams.channel_id),
        is_sub: !!(Number.parseInt(channelSearchParams.is_sub))
    }
}

export enum ChannelsErrorEnum {
    AlreadyExists = 1,
    URLIssue
}

export type ChannelsError = ChannelsErrorEnum | null;