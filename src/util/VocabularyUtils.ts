/**
 * Vocabulary used by the application ontological model.
 */

export interface IRI {
    namespace? : string,
    fragment : string,
}

export default {
    VOCABULARY: "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/slovnik",
    TERM: "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/term",
    FILE: "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/soubor",
    DOCUMENT: "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/document",
    USER: "http://onto.fel.cvut.cz/ontologies/application/termit/uzivatel-termitu",

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