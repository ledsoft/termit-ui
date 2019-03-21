/**
 * Vocabulary used by the application ontological model.
 */

export interface IRI {
    namespace?: string,
    fragment: string,
}

const _NS_POPIS_DAT = "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/";
const _NS_TERMIT = "http://onto.fel.cvut.cz/ontologies/application/termit/";
const _NS_RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
const _NS_RDFS = "http://www.w3.org/2000/01/rdf-schema#";

export default {
    PREFIX: _NS_POPIS_DAT,
    VOCABULARY: _NS_POPIS_DAT + "slovnik",
    TERM: _NS_POPIS_DAT + "term",
    FILE: _NS_POPIS_DAT + "soubor",
    DOCUMENT: _NS_POPIS_DAT + "dokument",
    DATASET: "http://onto.fel.cvut.cz/ontologies/dataset-descriptor/dataset",
    JE_POJMEM_ZE_SLOVNIKU: _NS_POPIS_DAT + "je-pojmem-ze-slovniku",
    RESOURCE: _NS_POPIS_DAT + "zdroj",
    TERM_ASSIGNMENT: _NS_POPIS_DAT + "prirazeni-termu",
    TERM_OCCURRENCE: _NS_POPIS_DAT + "vyskyt-termu",
    SUGGESTED_TERM_OCCURRENCE: _NS_POPIS_DAT + "navrzeny-vyskyt-termu",
    HAS_AUTHOR: _NS_POPIS_DAT + "ma-autora",
    CREATED: "http://purl.org/dc/terms/created",
    HAS_LAST_EDITOR: _NS_TERMIT + "ma-posledniho-editora",
    LAST_MODIFIED: _NS_TERMIT + "ma-posledni-modifikaci",
    NS_TERMIT: _NS_TERMIT,
    USER: _NS_TERMIT + "uzivatel-termitu",
    HAS_COUNT: _NS_TERMIT + "has-count",
    PREFIX_RDFS: _NS_RDFS,
    RDF_TYPE: _NS_RDF + "type",
    RDFS_LABEL: _NS_RDFS + "label",
    RDFS_COMMENT: _NS_RDFS + "comment",
    RDFS_RESOURCE: _NS_RDFS + "Resource",
    RDF_PROPERTY: _NS_RDF + "Property",

    getFragment(iri: string): string {
        return this.create(iri).fragment;
    },

    create(iri: string): IRI {
        const hashFragment = iri.indexOf("#");
        const slashFragment = iri.lastIndexOf("/");
        const fragment = hashFragment < 0 ? slashFragment : hashFragment;
        return {fragment: iri.substr(fragment + 1), namespace: iri.substr(0, fragment + 1)};
    }
}