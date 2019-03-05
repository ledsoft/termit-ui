import TermAssignment, {CONTEXT as ASSIGNMENT_CONTEXT, Target, TermAssignmentData} from "./TermAssignment";
import Utils from "../util/Utils";
import VocabularyUtils from "../util/VocabularyUtils";

const ctx = {
    "selectors": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/ma-selektor"
};

const textQuoteSelectorCtx = {
    "exactMatch": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/ma-presny-text-quote",
    "prefix": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/ma-prefix-text-quote",
    "suffix": "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/ma-suffix-text-quote"
};

export const CONTEXT = Object.assign({}, ASSIGNMENT_CONTEXT, ctx, textQuoteSelectorCtx);

export interface TextQuoteSelector {
    exactMatch: string;
    prefix?: string;
    suffix?: string;
}

export interface OccurrenceTarget extends Target {
    selectors: TextQuoteSelector[];
}

export default class TermOccurrence extends TermAssignment {
    public target: OccurrenceTarget;

    constructor(data: TermAssignmentData) {
        super(data);
    }

    public isSuggested(): boolean {
        return Utils.sanitizeArray(this.types).indexOf(VocabularyUtils.SUGGESTED_TERM_OCCURRENCE) !== -1;
    }
}

