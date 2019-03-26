import TermAssignment, {CONTEXT as ASSIGNMENT_CONTEXT, Target, TermAssignmentData} from "./TermAssignment";
import Utils from "../util/Utils";
import VocabularyUtils from "../util/VocabularyUtils";

const ctx = {
    "selectors": VocabularyUtils.NS_TERMIT + "má-selektor-termu"
};

const textQuoteSelectorCtx = {
    "exactMatch": VocabularyUtils.NS_TERMIT + "má-přesný-text-quote",
    "prefix": VocabularyUtils.NS_TERMIT + "má-prefix-text-quote",
    "suffix": VocabularyUtils.NS_TERMIT + "má-suffix-text-quote"
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

