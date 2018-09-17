import {CONTEXT as USER_CONTEXT} from "./User";

const ctx = {
    iri: '',
    label: '',
    subTerms: '',
    // TODO impement
};

export const CONTEXT = Object.assign(ctx, USER_CONTEXT);

export interface VocabularyTermData {
    label: string;
    comment?: string;
    iri: string;
    subTerms?: string[];
    parent?: string;
    types?: string[]
}

export default class VocabularyTerm implements VocabularyTermData {
    public label: string;
    public comment?: string;
    public iri: string;
    public subTerms?: string[];
    public parent?: string;
    public types?: string[];

    constructor(data: VocabularyTermData) {
        Object.assign(this, data);
    }

    public toJsonLd(): {} {
        // TODO implement this method
        throw new Error('Not implemented')
    }
}