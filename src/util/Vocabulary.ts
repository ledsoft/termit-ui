/**
 * Vocabulary used by the application ontological model.
 */
import constants from "./Constants";
import * as _ from "lodash";

export interface IRI {
    namespace? : string,
    fragment : string,
}

export default {
    VOCABULARY: "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/slovnik",
    TERM: "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/term",
    USER: "http://onto.fel.cvut.cz/ontologies/application/termit/uzivatel-termitu",

    equal(iri1 : IRI, iri2: IRI) {
        return _.isEqual(this.complete(iri1),this.complete(iri2));
    },

    resolve(iri : IRI) {
        const completed = this.complete(iri);
        return completed.namespace + completed.fragment;
    },

    complete(iri : IRI) {
        if (!iri.namespace) {
            iri.namespace = constants.namespace_vocabulary;
        }
        return iri;
    },

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