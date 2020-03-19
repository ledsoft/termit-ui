import ChangeRecord, {ChangeRecordData} from "./ChangeRecord";
import {Literal} from "../../util/Types";

interface ID {
    iri: string
}

export type UpdateValueType = ID | ID[] | Literal | Literal[];

export interface UpdateRecordData extends ChangeRecordData {
    changedAttribute: ID;
    originalValue?: undefined | UpdateValueType;
    newValue?: undefined | UpdateValueType;
}

/**
 * Represents an atomic update to an entity.
 */
export class UpdateRecord extends ChangeRecord implements UpdateRecordData {

    public readonly changedAttribute: { iri: string };
    public readonly originalValue?: undefined | ID | ID[] | Literal | Literal[];
    public readonly newValue?: undefined | ID | ID[] | Literal | Literal[];

    constructor(data: UpdateRecordData) {
        super(data);
        this.changedAttribute = data.changedAttribute;
        this.originalValue = data.originalValue;
        this.newValue = data.newValue;
    }

    get typeLabel(): string {
        return "history.type.update";
    }
}
