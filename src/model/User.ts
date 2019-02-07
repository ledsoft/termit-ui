import Utils from "../util/Utils";

export const CONTEXT = {
    "iri": "@id",
    "firstName": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/ma-krestni-jmeno",
    "lastName": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/ma-prijmeni",
    "username": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/ma-uzivatelske-jmeno",
    "types": "@type"
};

export interface UserAccountData {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
}

export interface UserData {
    iri: string;
    firstName: string;
    lastName: string;
    username: string;
    types?: string[];
}

/**
 * System user account.
 */
export default class User implements UserData {
    public readonly iri: string;
    public readonly firstName: string;
    public readonly lastName: string;
    public readonly username: string;
    public readonly types: string[];

    constructor(data: UserData) {
        Object.assign(this, data);
        this.types = Utils.sanitizeArray(data.types);
    }

    get fullName(): string {
        return this.firstName + " " + this.lastName;
    }

    get abbreviatedName(): string {
        return this.firstName.charAt(0).toUpperCase() + ". " + this.lastName;
    }
}

export const EMPTY_USER = new User({
    iri: "http://empty",
    firstName: "",
    lastName: "",
    username: ""
});
