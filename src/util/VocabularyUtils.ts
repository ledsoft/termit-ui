/**
 * Vocabulary used by the application ontological model.
 */

export interface IRI {
    namespace?: string;
    fragment: string;
}

export class IRIImpl implements IRI {
    public readonly fragment: string;
    public readonly namespace?: string;

    constructor(fragment: string, namespace?: string) {
        this.fragment = fragment;
        this.namespace = namespace;
    }

    public toString(): string {
        return IRIImpl.toString(this);
    }

    public equals(other?: IRI | null): boolean {
        return other !== undefined && other !== null && this.fragment === other.fragment && this.namespace === other.namespace;
    }

    public static create(iri: IRI): IRIImpl {
        return new IRIImpl(iri.fragment, iri.namespace);
    }

    public static toString(iri: IRI): string {
        return (iri.namespace ? iri.namespace : "") + iri.fragment;
    }
}

const _NS_POPIS_DAT = "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/";
const _NS_TERMIT = "http://onto.fel.cvut.cz/ontologies/application/termit/pojem/";
const _NS_RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
const _NS_RDFS = "http://www.w3.org/2000/01/rdf-schema#";
const _NS_SKOS = "http://www.w3.org/2004/02/skos/core#";

export default {
    PREFIX: _NS_POPIS_DAT,
    VOCABULARY: _NS_POPIS_DAT + "slovník",
    DOCUMENT_VOCABULARY: _NS_POPIS_DAT + "dokumentový-slovník",
    TERM: _NS_POPIS_DAT + "term",
    FILE: _NS_POPIS_DAT + "soubor",
    DOCUMENT: _NS_POPIS_DAT + "dokument",
    DEFINITION: _NS_SKOS + "definition",
    BROADER: _NS_SKOS + "broader",
    NARROWER: _NS_SKOS + "narrower",
    DATASET: "http://onto.fel.cvut.cz/ontologies/dataset-descriptor/dataset",
    IS_TERM_FROM_VOCABULARY: _NS_POPIS_DAT + "je-pojmem-ze-slovníku",
    IS_OCCURRENCE_OF_TERM: _NS_POPIS_DAT + "je-výskytem-termu",
    RESOURCE: _NS_POPIS_DAT + "zdroj",
    TERM_ASSIGNMENT: _NS_TERMIT + "přiřazení-termu",
    TERM_OCCURRENCE: _NS_TERMIT + "výskyt-termu",
    SUGGESTED_TERM_OCCURRENCE: _NS_TERMIT + "navržený-výskyt-termu",
    HAS_FILE: _NS_POPIS_DAT + "má-soubor",
    HAS_AUTHOR: _NS_POPIS_DAT + "má-autora",
    CREATED: _NS_POPIS_DAT + "má-datum-a-čas-vytvoření",
    HAS_LAST_EDITOR: _NS_POPIS_DAT + "má-posledního-editora",
    LAST_MODIFIED: _NS_POPIS_DAT + "má-datum-a-čas-poslední-modifikace",
    IMPORTS_VOCABULARY: _NS_POPIS_DAT + "importuje-slovník",
    NS_TERMIT: _NS_TERMIT,
    USER: _NS_TERMIT + "uživatel-termitu",
    USER_ADMIN: _NS_TERMIT + "administrátor-termitu",
    USER_LOCKED: _NS_TERMIT + "uzam\u010den\u00fd-u\u017eivatel-termitu",
    USER_DISABLED: _NS_TERMIT + "zablokovan\u00fd-u\u017eivatel-termitu",
    HAS_COUNT: _NS_TERMIT + "has-count",
    PREFIX_RDFS: _NS_RDFS,
    RDF_TYPE: _NS_RDF + "type",
    RDFS_LABEL: _NS_RDFS + "label",
    RDFS_COMMENT: _NS_RDFS + "comment",
    RDFS_RESOURCE: _NS_RDFS + "Resource",
    RDFS_SUB_CLASS_OF: _NS_RDFS + "subClassOf",
    RDFS_SUB_PROPERTY_OF: _NS_RDFS + "subPropertyOf",
    RDF_PROPERTY: _NS_RDF + "Property",
    DC_DESCRIPTION: "http://purl.org/dc/terms/description",

    getFragment(iri: string): string {
        return this.create(iri).fragment;
    },

    create(iri: string): IRIImpl {
        const hashFragment = iri.indexOf("#");
        const slashFragment = iri.lastIndexOf("/");
        const fragment = hashFragment < 0 ? slashFragment : hashFragment;
        return new IRIImpl(iri.substr(fragment + 1), iri.substr(0, fragment + 1));
    }
}
