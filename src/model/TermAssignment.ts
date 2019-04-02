import Term, {CONTEXT as TERM_CONTEXT, TermData} from "./Term";
import {CONTEXT as RESOURCE_CONTEXT, ResourceData} from "./Resource";
import {AssetData} from "./Asset";
import VocabularyUtils from "../util/VocabularyUtils";

const ctx = {
    "term": VocabularyUtils.NS_TERMIT + "je-přiřazením-termu",
    "description": VocabularyUtils.DC_DESCRIPTION,
    "target": VocabularyUtils.NS_TERMIT + "má-cíl",
    "source": VocabularyUtils.PREFIX + "má-zdroj"
};

export const CONTEXT = Object.assign({}, ctx, TERM_CONTEXT, RESOURCE_CONTEXT);

export interface Target {
    source: ResourceData;
}

export interface TermAssignmentData extends AssetData {
    term: TermData;
    target: Target;
    description?: string;
    types: string[];
}

export default class TermAssignment implements TermAssignmentData {
    public iri: string;
    public term: Term;
    public target: Target;
    public description?: string;
    public types: string[];

    constructor(data: TermAssignmentData) {
        Object.assign(this, data);
        this.term = new Term(data.term);
    }

    public isSuggested() {
        return false;
    }
}
