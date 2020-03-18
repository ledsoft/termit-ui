import VocabularyUtils from "../../util/VocabularyUtils";
import {CONTEXT as USER_CONTEXT, UserData} from "../User";

const ctx = {
    timestamp: `${VocabularyUtils.PREFIX}m\u00e1-datum-a-\u010das-modifikace`,
    author: `${VocabularyUtils.PREFIX}m\u00e1-editora`,
    changedEntity: `${VocabularyUtils.NS_CHANGE_TRACKING}m\u00e1-zm\u011bn\u011bnou-entitu`,
    changedAttribute: `${VocabularyUtils.NS_CHANGE_TRACKING}m\u00e1-zm\u011bn\u011bn\u00fd-atribut`,
    originalValue: `${VocabularyUtils.NS_CHANGE_TRACKING}m\u00e1-p\u016fvodn\u00ed-hodnotu`,
    newValue: `${VocabularyUtils.NS_CHANGE_TRACKING}m\u00e1-novou-hodnotu`
};

export const CONTEXT = Object.assign({}, ctx, USER_CONTEXT);

export interface ChangeRecordData {
    timestamp: number;
    author: UserData;
    changedEntity: { iri: string };
    types: string[];
}

/**
 * Allows to track the history of an entity.
 */
export default abstract class ChangeRecord implements ChangeRecordData {

    public readonly timestamp: number;
    public readonly author: UserData;
    public readonly changedEntity: { iri: string };
    public readonly types: string[];

    protected constructor(data: ChangeRecordData) {
        Object.assign(this, data);
    }
}
