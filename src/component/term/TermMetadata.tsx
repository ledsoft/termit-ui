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
import {updateTerm} from "../../action/AsyncActions";
import Vocabulary from "../../model/Vocabulary";

interface TermMetadataOwnProps {
    vocabulary: Vocabulary;
    term: Term;
}

interface TermMetadataDispatchProps {
    updateTerm: (term: Term, vocabulary: Vocabulary) => Promise<any>;
}

interface TermMetadataState {
    edit: boolean;
}

type TermMetadataProps = TermMetadataOwnProps & TermMetadataDispatchProps & HasI18n;

export class TermMetadata extends React.Component<TermMetadataProps, TermMetadataState> {

    constructor(props: TermMetadataProps) {
        super(props);
        this.state = {
            edit: false
        };
    }

    private onEdit = () => {
        this.setState({edit: true});
    };

    public onSave = (term: Term) => {
        this.props.updateTerm(term, this.props.vocabulary).then(() => this.onCloseEdit());
    };

    public onCloseEdit = () => {
        this.setState({edit: false});
    };

    public render() {
        return this.state.edit ? <TermMetadataEdit save={this.onSave} term={this.props.term}
                                                   cancel={this.onCloseEdit}/> : this.renderMetadata();
    }

    private renderMetadata() {
        const i18n = this.props.i18n;
        const term = this.props.term;
        return <div className='metadata-panel'>
            <ButtonToolbar className='pull-right clearfix'>
                <Button size='sm' color='info' onClick={this.onEdit} title={i18n('edit')}><GoPencil/></Button>
            </ButtonToolbar>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('term.metadata.identifier')}</Label>
                </Col>
                <Col md={10}>
                    <OutgoingLink iri={term.iri} label={term.iri}/>
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('term.metadata.label')}</Label>
                </Col>
                <Col md={10}>
                    {term.label}
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('term.metadata.comment')}</Label>
                </Col>
                <Col md={10}>
                    {term.comment}
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('term.metadata.subTerms')}</Label>
                </Col>
                <Col md={10}>
                    {this.renderItems(term.subTerms, true)}
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('term.metadata.types')}</Label>
                </Col>
                <Col md={10}>
                    {this.renderItems(term.types, true)}
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
        </div>;
    }

    private renderItems(items: string[] | string | undefined, withLink: boolean = false) {
        if (!items) {
            return null;
        }
        const source = Array.isArray(items) ? items : [items];
        return <ul className='term-items'>{source.map((item: string) => <li key={item}>{withLink ?
            <OutgoingLink iri={item} label={item}/> : item}</li>)}</ul>;
    }
}

export default connect<{}, TermMetadataDispatchProps, TermMetadataOwnProps>((state: {}, ownProps: TermMetadataOwnProps): {} => {
    return {...ownProps};
}, (dispatch: ThunkDispatch): TermMetadataDispatchProps => {
    return {
        updateTerm: (term: Term, vocabulary: Vocabulary) => dispatch(updateTerm(term, vocabulary))
    };
})(injectIntl(withI18n(TermMetadata)));