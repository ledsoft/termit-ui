import {AssetData} from "../../model/Asset";
import Generator from "../../__tests__/environment/Generator";
import AssetFactory from "../AssetFactory";
import VocabularyUtils from "../VocabularyUtils";
import Term from "../../model/Term";
import Vocabulary from "../../model/Vocabulary";
import Document from "../../model/Document";
import File from "../../model/File";
import Resource, {ResourceData} from "../../model/Resource";

describe("AssetFactory", () => {
    describe("createAsset", () => {
        const basicData: AssetData = {
            iri: Generator.generateUri(),
            label: "Test"
        };

        it("creates correct asset instance based on data", () => {
            expect(AssetFactory.createAsset(Object.assign({}, basicData, {types: VocabularyUtils.TERM}))).toBeInstanceOf(Term);
            expect(AssetFactory.createAsset(Object.assign({}, basicData, {types: VocabularyUtils.VOCABULARY}))).toBeInstanceOf(Vocabulary);
            expect(AssetFactory.createAsset(Object.assign({}, basicData, {types: [VocabularyUtils.DOCUMENT, VocabularyUtils.RESOURCE]}))).toBeInstanceOf(Document);
            expect(AssetFactory.createAsset(Object.assign({}, basicData, {types: [VocabularyUtils.RESOURCE, VocabularyUtils.FILE]}))).toBeInstanceOf(File);
            expect(AssetFactory.createAsset(Object.assign({}, basicData, {types: [VocabularyUtils.RESOURCE, VocabularyUtils.DATASET]}))).toBeInstanceOf(Resource);
            expect(AssetFactory.createAsset(Object.assign({}, basicData, {types: [VocabularyUtils.RESOURCE]}))).toBeInstanceOf(Resource);
        });

        it("throws unsupported asset type exception when data of unknown type are passed in", () => {
            expect(() => AssetFactory.createAsset(basicData)).toThrow(new TypeError("Unsupported type of asset data " + JSON.stringify(basicData)));
        });
    });

    describe("createResource", () => {
        const basicData: ResourceData = {
            iri: Generator.generateUri(),
            label: "Test"
        };

        it("creates correct resource (sub)type instance from data", () => {
            expect(AssetFactory.createResource(Object.assign({}, basicData, {types: [VocabularyUtils.DOCUMENT, VocabularyUtils.RESOURCE]}))).toBeInstanceOf(Document);
            expect(AssetFactory.createResource(Object.assign({}, basicData, {types: [VocabularyUtils.RESOURCE, VocabularyUtils.FILE]}))).toBeInstanceOf(File);
            expect(AssetFactory.createResource(Object.assign({}, basicData, {types: [VocabularyUtils.RESOURCE, VocabularyUtils.DATASET]}))).toBeInstanceOf(Resource);
            expect(AssetFactory.createResource(Object.assign({}, basicData, {types: [VocabularyUtils.RESOURCE]}))).toBeInstanceOf(Resource);
        });

        it("throws unsupported asset type exception when data of unknown type are passed in", () => {
            const data = Object.assign({}, basicData, {types: VocabularyUtils.TERM});
            expect(() => AssetFactory.createResource(data)).toThrow(new TypeError("Unsupported type of resource data " + JSON.stringify(data)));
        });
    });
});