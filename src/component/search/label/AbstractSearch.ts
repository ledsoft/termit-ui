import * as React from "react";
import SearchResult from "../../../model/SearchResult";
import Vocabulary from "../../../util/VocabularyUtils";
import Routing from "../../../util/Routing";
import Routes from "../../../util/Routes";

export interface SearchState {
    searchString: string;
    results: SearchResult[] | null;
}

export class AbstractSearch<P, T> extends React.Component<P, T> {

    public openResult = (result: SearchResult) => {
        if (result.types.indexOf(Vocabulary.VOCABULARY) !== -1) {
            const iri = Vocabulary.create(result.iri);
            Routing.transitionTo(Routes.vocabularySummary, {
                params: new Map([['name', iri.fragment]]),
                query: new Map([['namespace', iri.namespace!]])
            });
        } else {
            const vocabularyIri = Vocabulary.create(result.vocabulary!.iri);
            Routing.transitionTo(Routes.vocabularyTermDetail, {
                params: new Map([['name', vocabularyIri.fragment], ['termName', Vocabulary.getFragment(result.iri)]]),
                query: new Map([['namespace', vocabularyIri.namespace!]])
            });
        }
    };

}
