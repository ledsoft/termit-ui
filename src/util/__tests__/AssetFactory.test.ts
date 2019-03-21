import {AssetData} from "../../model/Asset";
import Generator from "../../__tests__/environment/Generator";
import AssetFactory from "../AssetFactory";
import VocabularyUtils from "../VocabularyUtils";
import Term from "../../model/Term";
import Vocabulary from "../../model/Vocabulary";
import Document from "../../model/Document";
import File from "../../model/File";
import Resource, {ResourceData} from "../../model/Resource";
import TermAssignment from "../../model/TermAssignment";
import TermOccurrence from "../../model/TermOccurrence";

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

    describe("createTermAssignment", () => {
        const data = {
            iri: "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/prirazeni-termu/instance1741423723",
            types: [
                "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/prirazeni-termu"
            ],
            term: {
                iri: "http://onto.fel.cvut.cz/ontologies/slovnik/sb-z-2006-183/pojem/nezastavene-uzemi",
                types: [
                    "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/term"
                ],
                label: "Nezastavene uzemi"
            },
            target: {
                iri: "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/cil/instance-873441519",
                types: [
                    "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/cil"
                ],
                source: {
                    iri: "http://onto.fel.cvut.cz/ontologies/zdroj/ml-test",
                    types: [
                        "http://onto.fel.cvut.cz/ontologies/dataset-descriptor/dataset",
                        "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/zdroj"
                    ],
                    label: "ML test",
                    author: {
                        iri: "http://onto.fel.cvut.cz/ontologies/uzivatel/catherine-halsey",
                        types: [
                            "http://onto.fel.cvut.cz/ontologies/application/termit/uzivatel-termitu"
                        ],
                        firstName: "Catherine",
                        lastName: "Halsey",
                        username: "halsey@unsc.org"
                    },
                    created: 1548760789068
                }
            }
        };

        it("creates term assignment when data are for assignment only", () => {
            const result = AssetFactory.createTermAssignment(data);
            expect(result).not.toBeNull();
            expect(result).toBeInstanceOf(TermAssignment);
        });

        it("creates term occurrence when data contain occurrence type", () => {
            data.types = [VocabularyUtils.TERM_OCCURRENCE, ...data.types];
            const result = AssetFactory.createTermAssignment(data);
            expect(result).not.toBeNull();
            expect(result).toBeInstanceOf(TermOccurrence);
        });

        it("throws unsupported type exception when data of unknown type are passed in", () => {
            data.types = [];
            expect(() => AssetFactory.createTermAssignment(data)).toThrow(new TypeError("Unsupported type of assignment data " + JSON.stringify(data)));
        });
    });
});