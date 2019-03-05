import Term, {CONTEXT as TERM_CONTEXT, TermData} from "./Term";
import {CONTEXT as RESOURCE_CONTEXT, ResourceData} from "./Resource";
import {AssetData} from "./Asset";

const ctx = {
    "term": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/je-prirazenim-termu",
    "description": "http://purl.org/dc/elements/1.1/description",
    "target": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/ma-cil",
    "source": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/ma-zdroj"
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
