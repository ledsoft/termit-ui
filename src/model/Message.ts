/**
 * Represents a message published by TermIt UI's internal notification system.
 *
 * Examples of messages published by this system are successful creation of a term, save of a record etc.
 *
 * An instance can contain either directly the text of the message, or a message id used by the i18n function.
 */
export default class Message {
    private readonly mMessage?: string;
    private readonly mMessageId?: string;
    private readonly mValues?: {};    // Values for message formatting, relevant only for messageId
    /*
     * Indicates when the message was first displayed.
     *
     * Necessary for message timeout support.
     */
    private mFirstDisplayed: number;

    constructor(data: {
        message?: string;
        messageId?: string;
        values?: {};
    }) {
        this.mMessage = data.message;
        this.mMessageId = data.messageId;
        this.mValues = data.values;
        this.firstDisplayed = 0;
    }

    get message(): string | undefined {
        return this.mMessage;
    }

    get messageId(): string | undefined {
        return this.mMessageId;
    }

    get values(): {} | undefined {
        return this.mValues;
    }

    get firstDisplayed(): number {
        return this.mFirstDisplayed;
    }


    set firstDisplayed(value: number) {
        this.mFirstDisplayed = value;
    }
}

export function createStringMessage(text: string) {
    return new Message({message: text});
}

export function createFormattedMessage(mId: string, values?: {}) {
    return new Message({
        messageId: mId,
        values
    });
}