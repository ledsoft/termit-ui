/**
 * System user account.
 */
export default class User {
    private readonly mUri: string;
    private readonly mFirstName: string;
    private readonly mLastName: string;
    private readonly mUsername: string;
    private readonly mTypes: string[];

    constructor(data: {
        uri: string,
        firstName: string,
        lastName: string,
        username: string,
        types?: string[]
    }) {
        this.mUri = data.uri;
        this.mFirstName = data.firstName;
        this.mLastName = data.lastName;
        this.mUsername = data.username;
        this.mTypes = data.types ? data.types : []
    }

    get uri(): string {
        return this.mUri;
    }

    get firstName(): string {
        return this.mFirstName;
    }

    get lastName(): string {
        return this.mLastName;
    }

    get username(): string {
        return this.mUsername;
    }

    get types(): string[] {
        return this.mTypes;
    }
}

export const EMPTY_USER = new User({
    uri: 'http://empty',
    firstName: '',
    lastName: '',
    username: ''
});