/**
 * Vocabulary used by the application ontological model.
 */

export interface IRI {
    namespace? : string,
    fragment : string,
}

const _PREFIX = "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/";

export default {
    PREFIX: _PREFIX,
    VOCABULARY: _PREFIX+"slovnik",
    TERM: _PREFIX+"term",
    FILE: _PREFIX+"soubor",
    DOCUMENT: _PREFIX+"document",
    JE_POJMEM_ZE_SLOVNIKU: _PREFIX+"je-pojmem-ze-slovniku",
    USER: "http://onto.fel.cvut.cz/ontologies/application/termit/uzivatel-termitu",
    RDFS_RESOURCE: "http://www.w3.org/2000/01/rdf-schema#Resource",
    RDF_PROPERTY: "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",

    getFragment(iri : string) :string {
        return this.create(iri).fragment;
    },

    create(iri : string) :IRI {
        const hashFragment = iri.indexOf("#");
        const slashFragment = iri.lastIndexOf("/");
        const fragment = hashFragment < 0 ? slashFragment : hashFragment;
        return {fragment:iri.substr(fragment+1),namespace:iri.substr(0,fragment+1)};
    }
}