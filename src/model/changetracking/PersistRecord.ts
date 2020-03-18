import ChangeRecord, {ChangeRecordData} from "./ChangeRecord";

/**
 * Represents insertion of an entity into the repository.
 */
export default class PersistRecord extends ChangeRecord {

    constructor(data: ChangeRecordData) {
        super(data);
    }
}
