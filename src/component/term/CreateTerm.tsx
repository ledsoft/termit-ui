import * as React from "react";
import Term from "../../model/Term";
import VocabularyUtils, {IRI} from "../../util/VocabularyUtils";
import {connect} from "react-redux";
import {ThunkDispatch} from "../../util/Types";
import {createTerm} from "../../action/AsyncActions";
import TermMetadataCreate from "./TermMetadataCreate";
import Routing from "../../util/Routing";
import Routes from "../../util/Routes";
import IdentifierResolver from "../../util/IdentifierResolver";
import TermItState from "../../model/TermItState";
import Vocabulary, {EMPTY_VOCABULARY} from "../../model/Vocabulary";

interface CreateTermProps {
    vocabulary: Vocabulary;
    createTerm: (term: Term, vocabularyIri: IRI) => Promise<string>;
}

export class CreateTerm extends React.Component<CreateTermProps> {

    public onCreate = (term: Term) => {
        const vocabularyIri = VocabularyUtils.create(this.props.vocabulary.iri);
        this.props.createTerm(term, vocabularyIri).then((location: string) => {
            if (!location) {
                return;
            }
            const termName = IdentifierResolver.extractNameFromLocation(location);
            Routing.transitionTo(Routes.vocabularyTermDetail, {
                params: new Map([["name", vocabularyIri.fragment], ["termName", termName]]),
                query: new Map([["namespace", vocabularyIri.namespace!]])
            });
        });
    };

    public render() {
        return this.props.vocabulary !== EMPTY_VOCABULARY ?
            <TermMetadataCreate onCreate={this.onCreate} vocabularyIri={this.props.vocabulary.iri}/> : null;
    }
}

export default connect((state: TermItState) => {
    return {
        vocabulary: state.vocabulary
    };
}, (dispatch: ThunkDispatch) => {
    return {
        createTerm: (term: Term, vocabularyIri: IRI) => dispatch(createTerm(term, vocabularyIri))
    };
})(CreateTerm);
