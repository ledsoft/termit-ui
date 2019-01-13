import {AssetData} from "../model/Asset";
import Vocabulary, {VocabularyData} from "../model/Vocabulary";
import Resource, {ResourceData} from "../model/Resource";
import Document, {DocumentData} from "../model/Document";
import File, {FileData} from "../model/File";
import Term, {TermData} from "../model/Term";
import Utils from "./Utils";
import VocabularyUtils from "./VocabularyUtils";


export default {
    /**
     * Creates an instance of the appropriate asset based on the specified data.
     *
     * @param data Data for asset instantiation
     */
    createAsset(data: AssetData): Term | Vocabulary | Document | File | Resource {
        switch (Utils.getPrimaryAssetType(data)) {
            case VocabularyUtils.TERM:
                return new Term(data as TermData);
            case VocabularyUtils.VOCABULARY:
                return new Vocabulary(data as VocabularyData);
            case VocabularyUtils.DOCUMENT:
                return new Document(data as DocumentData);
            case VocabularyUtils.FILE:
                return new File(data as FileData);
            case VocabularyUtils.DATASET:   // Intentional fall-through
            case VocabularyUtils.RESOURCE:
                return new Resource(data as ResourceData);
            default:
                throw new TypeError("Unsupported type of asset data " + JSON.stringify(data));
        }
    }
};
