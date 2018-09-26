export interface ErrorData {
    requestUrl?: string,
    messageId?: string,
    message?: string,
    status?: number  // Response status
}

/**
 * Represents error received from the server API.
 */
export default class ErrorInfo {
    private readonly mOrigin: string;
    private readonly mRequestUrl?: string;
    private readonly mMessageId?: string;
    private readonly mMessage?: string;
    private readonly mStatus?: number;

    constructor(origin: string, data: ErrorData) {
        this.mOrigin = origin;
        this.mRequestUrl = data.requestUrl;
        this.mMessage = data.message;
        this.mMessageId = data.messageId;
        this.mStatus = data.status;
    }

    /**
     * Represents the action which originated this error
     */
    public get origin(): string {
        return this.mOrigin;
    }

    public get requestUrl(): string | undefined {
        return this.mRequestUrl;
    }

    public get messageId(): string | undefined {
        return this.mMessageId;
    }

    public get message(): string | undefined {
        return this.mMessage;
    }

    public get status(): number | undefined {
        return this.mStatus;
    }
}

export const EMPTY_ERROR = new ErrorInfo('', {});