export interface ErrorData {
    requestUrl?: string,
    messageId?: string,
    message?: string
}

/**
 * Represents error received from the server API.
 */
export default class ErrorInfo {
    private readonly mOrigin: string;
    private readonly mRequestUrl?: string;
    private readonly mMessageId?: string;
    private readonly mMessage?: string;

    constructor(origin: string, data: ErrorData) {
        this.mOrigin = origin;
        this.mRequestUrl = data.requestUrl;
        this.mMessage = data.message;
        this.mMessageId = data.messageId;
    }

    /**
     * Represents the action which originated this error
     */
    get origin(): string {
        return this.mOrigin;
    }

    get requestUrl(): string | undefined {
        return this.mRequestUrl;
    }

    get messageId(): string | undefined {
        return this.mMessageId;
    }

    get message(): string | undefined {
        return this.mMessage;
    }
}

export const EMPTY_ERROR = new ErrorInfo('', {});