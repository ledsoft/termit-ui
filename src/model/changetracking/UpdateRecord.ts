import ChangeRecord, {ChangeRecordData} from "./ChangeRecord";

interface ID {
    iri: string
}

declare type Literal = number | string | boolean;

export interface UpdateRecordData extends ChangeRecordData {
    changedAttribute: ID;
    originalValue?: undefined | ID | ID[] | Literal | Literal[];
    newValue?: undefined | ID | ID[] | Literal | Literal[];
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
