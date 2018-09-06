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

    constructor(data: {
        message?: string;
        messageId?: string;
        values?: {};
    }) {
        this.mMessage = data.message;
        this.mMessageId = data.messageId;
        this.mValues = data.values;
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