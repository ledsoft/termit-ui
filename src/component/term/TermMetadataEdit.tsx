import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Button, ButtonToolbar, Col, Form, Row} from "reactstrap";
import Term, {TermData} from "../../model/Term";
import "./TermMetadata.scss";
import CustomInput from "../misc/CustomInput";
import TextArea from "../misc/TextArea";
import Vocabulary from "../../model/Vocabulary";
import Ajax, {params} from "../../util/Ajax";
import Constants from '../../util/Constants';
import VocabularyUtils from "../../util/VocabularyUtils";
import TermSourcesEdit from "./TermSourcesEdit";
import TermTypesEdit from "./TermTypesEdit";
import Utils from "../../util/Utils";
import TermSubTermsEdit from "./TermSubTermsEdit";
import {AssetData} from "../../model/Asset";
import UnmappedPropertiesEdit from "../genericmetadata/UnmappedPropertiesEdit";

interface TermMetadataEditProps extends HasI18n {
    vocabulary: Vocabulary,
    term: Term,
    save: (term: Term) => void;
    cancel: () => void;
}

interface TermMetadataEditState extends TermData {
    labelExists: boolean;
}

export class TermMetadataEdit extends React.Component<TermMetadataEditProps, TermMetadataEditState> {
    constructor(props: TermMetadataEditProps) {
        super(props);
        this.state = Object.assign({labelExists: false}, props.term);
    }

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const change = {};
        change[e.currentTarget.name] = e.currentTarget.value;
        this.setState(change);
    };

    private onLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.onChange(e);
        this.setState({labelExists: false});
        const label = e.currentTarget.value;
        if (label === this.props.term.label) {
            return;
        }
        const vocabIri = VocabularyUtils.create(this.props.vocabulary.iri);
        const url = Constants.API_PREFIX + '/vocabularies/' + vocabIri.fragment + '/terms/name';
        Ajax.get(url, params({namespace: vocabIri.namespace, value: label})).then((data) => {
            this.setState({labelExists: data === true});
        });
    };

    private onSourcesChange = (newSources: string[]) => {
        this.setState({sources: newSources});
    };

    private onTypesChange = (newTypes: string[]) => {
        this.setState({types: newTypes});
    };

    private onSubTermsChange = (newChildren: AssetData[]) => {
        this.setState({subTerms: newChildren, plainSubTerms: newChildren.map(t => t.iri!)});
    };

    private onSave = () => {
        const t = new Term(this.state);
        this.props.save(t);
    };

    private isValid(): boolean {
        return this.state.iri!.length > 0 && this.state.label.length > 0 && !this.state.labelExists;
    }

    public render() {
        const i18n = this.props.i18n;
        return <div className='term-edit-panel'>
            <Form>
                <Row>
                    <Col xl={6} md={12}>
                        <CustomInput name='iri' onChange={this.onChange} value={this.state.iri} disabled={true}
                                     label={i18n('term.metadata.identifier')}/>
                    </Col>
                </Row>
                <Row>
                    <Col xl={6} md={12}>
                        <CustomInput name='label' value={this.state.label} onChange={this.onLabelChange}
                                     label={i18n('term.metadata.label')} invalid={this.state.labelExists}
                                     invalidMessage={this.state.labelExists ? this.props.formatMessage('term.metadata.labelExists.message', {label: this.state.label}) : undefined}/>
                    </Col>
                </Row>
                <Row>
                    <Col xl={6} md={12}>
                        <TextArea name='comment' value={this.state.comment}
                                  onChange={this.onChange} rows={3} label={i18n('term.metadata.comment')}/>
                    </Col>
                </Row>
                <Row>
                    <Col xl={6} md={12}>
                        <TermSubTermsEdit subTerms={Utils.sanitizeArray(this.state.subTerms)}
                                          termIri={this.props.term.iri}
                                          vocabulary={this.props.vocabulary} onChange={this.onSubTermsChange}/>
                    </Col>
                </Row>
                <Row>
                    <Col xl={6} md={12}>
                        <TermTypesEdit termTypes={Utils.sanitizeArray(this.state.types)} onChange={this.onTypesChange}/>
                    </Col>
                </Row>
                <Row>
                    <Col xl={6} md={12}>
                        <TermSourcesEdit onChange={this.onSourcesChange}
                                         sources={Utils.sanitizeArray(this.state.sources)}/>
                    </Col>
                </Row>
                <UnmappedPropertiesEdit properties={this.props.term.unmappedProperties}/>
                <Row>
                    <Col xl={6} md={12}>
                        <ButtonToolbar className='pull-right term-edit-buttons'>
                            <Button size='sm' color='success' disabled={!this.isValid()}
                                    onClick={this.onSave}>{i18n('save')}</Button>
                            <Button size='sm' color='secondary' onClick={this.props.cancel}>{i18n('cancel')}</Button>
                        </ButtonToolbar>
                    </Col>
                </Row>
            </Form>
        </div>;
    }
}

export default injectIntl(withI18n(TermMetadataEdit));