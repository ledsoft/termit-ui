import * as jsonld from "jsonld";
import Vocabulary, {CONTEXT, VocabularyData} from "../Vocabulary";
import VocabularyUtils from "../../util/VocabularyUtils";

describe('Vocabulary', () => {

    it('constructor and toJsonLd are symmetric', () => {
        const jsonldData = require('../../rest-mock/vocabulary');
        return jsonld.compact(jsonldData, CONTEXT).then((data: VocabularyData) => {
            const vocabulary = new Vocabulary(data);
            const result: VocabularyData = vocabulary.toJsonLd();
            expect(result.types).toEqual([VocabularyUtils.VOCABULARY]);
        });
    });
});