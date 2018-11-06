import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Button, ButtonToolbar, Col, Label, Row} from "reactstrap";
import Term from "../../model/Term";
import OutgoingLink from "../misc/OutgoingLink";
import "./TermMetadata.scss";
import TermMetadataEdit from "./TermMetadataEdit";
import {GoPencil} from "react-icons/go";
import {connect} from 'react-redux';
import {ThunkDispatch} from "../../util/Types";
import {loadDefaultTerms, updateTerm} from "../../action/AsyncActions";
import Vocabulary from "../../model/Vocabulary";
import {getVocabularyTermByName} from "../../action/ComplexActions";
import VocabularyUtils from "../../util/VocabularyUtils";
import Utils from "../../util/Utils";
import Routes from "../../util/Routes";
import Routing from '../../util/Routing';
import EditableComponent from "../misc/EditableComponent";
import UnmappedProperties from "../genericmetadata/UnmappedProperties";

interface TermMetadataOwnProps {
    vocabulary: Vocabulary;
    term: Term;
}

interface TermMetadataDispatchProps {
    updateTerm: (term: Term, vocabulary: Vocabulary) => Promise<any>;
    loadTerm: (term: Term, vocabulary: Vocabulary) => void;
    reloadVocabularyTerms: (vocabulary: Vocabulary) => void;
}

type TermMetadataProps = TermMetadataOwnProps & TermMetadataDispatchProps & HasI18n;

export class TermMetadata extends EditableComponent<TermMetadataProps> {

    constructor(props: TermMetadataProps) {
        super(props);
        this.state = {
            edit: false
        };
    }

    public componentDidUpdate(prevProps: TermMetadataProps) {
        if (this.props.term !== prevProps.term) {
            this.onCloseEdit();
        }
    }

    public onSave = (term: Term) => {
        this.props.updateTerm(term, this.props.vocabulary).then(() => {
            this.props.loadTerm(term, this.props.vocabulary);
            this.props.reloadVocabularyTerms(this.props.vocabulary);
            this.onCloseEdit();
        });
    };

    public openSubTerm = (term: Term) => {
        Routing.transitionTo(Routes.vocabularyTermDetail, {
            params: new Map([['name', VocabularyUtils.getFragment(this.props.vocabulary.iri)], ['termName', VocabularyUtils.getFragment(term.iri)]])
        });
    };

    public render() {
        return this.state.edit ?
            <TermMetadataEdit save={this.onSave} term={this.props.term} vocabulary={this.props.vocabulary}
                              cancel={this.onCloseEdit}/> : this.renderMetadata();
    }

    private renderMetadata() {
        const i18n = this.props.i18n;
        const term = this.props.term;
        return <div className='metadata-panel'>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('term.metadata.identifier')}</Label>
                </Col>
                <Col md={10}>
                    <OutgoingLink iri={term.iri} label={term.iri}/>
                    <ButtonToolbar className='pull-right clearfix'>
                        <Button size='sm' color='info' onClick={this.onEdit} title={i18n('edit')}><GoPencil/></Button>
                    </ButtonToolbar>
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('term.metadata.label')}</Label>
                </Col>
                <Col md={10}>
                    <Label>{term.label}</Label>
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('term.metadata.comment')}</Label>
                </Col>
                <Col md={10}>
                    <Label>{term.comment}</Label>
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('term.metadata.subTerms')}</Label>
                </Col>
                <Col md={10}>
                    {this.renderSubTerms()}
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('term.metadata.types')}</Label>
                </Col>
                <Col md={10}>
                    {this.renderItems(term.types)}
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('term.metadata.source')}</Label>
                </Col>
                <Col md={10}>
                    {this.renderItems(term.sources)}
                </Col>
            </Row>
            <UnmappedProperties properties={term.unmappedProperties}/>
        </div>;
    }

    private renderSubTerms() {
        const source = Utils.sanitizeArray(this.props.term.subTerms);
        if (source.length === 0) {
            return null;
        }
        return <ul className='term-items'>{source.map(item => <li key={item.iri}>
            <OutgoingLink iri={item.iri!}
                          label={<Button color='link' onClick={this.openSubTerm.bind(null, item)}>{item.iri}</Button>}/>
        </li>)}
        </ul>;
    }

    private renderItems(items: string[] | string | undefined) {
        if (!items) {
            return null;
        }
        const source = Utils.sanitizeArray(items);
        return <ul className='term-items'>{source.map((item: string) => <li key={item}>{Utils.isLink(item) ?
            <OutgoingLink iri={item} label={item}/> : <Label>{item}</Label>}</li>)}</ul>;
    }
}

export default connect<{}, TermMetadataDispatchProps, TermMetadataOwnProps>((state: {}, ownProps: TermMetadataOwnProps): {} => {
    return {...ownProps};
}, (dispatch: ThunkDispatch): TermMetadataDispatchProps => {
    return {
        updateTerm: (term: Term, vocabulary: Vocabulary) => dispatch(updateTerm(term, vocabulary)),
        loadTerm: (term: Term, vocabulary: Vocabulary) => dispatch(getVocabularyTermByName(VocabularyUtils.getFragment(term.iri), VocabularyUtils.getFragment(vocabulary.iri))),
        reloadVocabularyTerms: (vocabulary: Vocabulary) => dispatch(loadDefaultTerms(VocabularyUtils.getFragment(vocabulary.iri)))
    };
})(injectIntl(withI18n(TermMetadata)));