import * as React from "react";
import Routing from "../../../util/Routing";
import {CreateVocabulary} from "../CreateVocabulary";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import Routes from "../../../util/Routes";
import Ajax from "../../../util/Ajax";
import Vocabulary from "../../../model/Vocabulary";
import {shallow} from "enzyme";

jest.mock("../../../util/Routing");
jest.mock("../../../util/Ajax", () => ({
    default: jest.fn(),
    content: require.requireActual("../../../util/Ajax").content,
    params: require.requireActual("../../../util/Ajax").params,
    param: require.requireActual("../../../util/Ajax").param,
    accept: require.requireActual("../../../util/Ajax").accept,
}));

describe("Create vocabulary view", () => {

    const iri = "http://onto.fel.cvut.cz/ontologies/termit/vocabulary/test";

    let onCreate: (vocabulary: Vocabulary) => void;

    beforeEach(() => {
        Ajax.get = jest.fn().mockImplementation(() => Promise.resolve(iri));
        onCreate = jest.fn();
    });

    it("returns to Vocabulary Management on cancel", () => {
        shallow<CreateVocabulary>(<CreateVocabulary onCreate={onCreate} {...intlFunctions()}/>);
        CreateVocabulary.onCancel();
        expect(Routing.transitionTo).toHaveBeenCalledWith(Routes.vocabularies);
    });
});
