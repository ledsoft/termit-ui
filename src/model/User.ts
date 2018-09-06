export const CONTEXT = {
    "iri": "@id",
    "firstName": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/ma-krestni-jmeno",
    "lastName": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/ma-prijmeni",
    "username": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/ma-uzivatelske-jmeno",
    "types": "@type"
};

export interface UserData {
    iri: string,
    firstName: string,
    lastName: string,
    username: string,
    types?: string[]
}
/**
 * System user account.
 */
export default class User implements UserData {
    private readonly mIri: string;
    private readonly mFirstName: string;
    private readonly mLastName: string;
    private readonly mUsername: string;
    private readonly mTypes: string[];

    constructor(data: UserData) {
        this.mIri = data.iri;
        this.mFirstName = data.firstName;
        this.mLastName = data.lastName;
        this.mUsername = data.username;
        this.mTypes = data.types ? data.types : []
    }

    get iri(): string {
        return this.mIri;
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

    get fullName(): string {
        return this.firstName + ' ' + this.lastName;
    }

    get abbreviatedName(): string {
        return this.firstName.charAt(0).toUpperCase() + '. ' + this.lastName;
    }
}

export const EMPTY_USER = new User({
    iri: 'http://empty',
    firstName: '',
    lastName: '',
    username: ''
});
