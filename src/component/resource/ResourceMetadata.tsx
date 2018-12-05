import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Col, Label, Row} from "reactstrap";
import OutgoingLink from "../misc/OutgoingLink";
import Resource from "../../model/Resource";
import Term from "../../model/Term";
import VocabularyUtils from "../../util/VocabularyUtils";
import Routing from "../../util/Routing";
import Routes from "../../util/Routes";

interface ResourceMetadataProps extends HasI18n {
    resource: Resource;
}

class ResourceMetadata extends React.Component<ResourceMetadataProps> {
    constructor(props: ResourceMetadataProps) {
        super(props);
    }

    public openResult = (term: Term) => {
        this.clear();
        const termIri = VocabularyUtils.create(term.iri!);
        const vocabularyIri = VocabularyUtils.create(term.vocabulary!.iri!);
        Routing.transitionTo(Routes.vocabularyTermDetail, {
            params: new Map([['name', vocabularyIri.fragment], ['termName', termIri.fragment]]),
            query: new Map([['namespace', vocabularyIri.namespace!]])
        });
    };

    protected clear = () => {
        this.setState({searchString: '', results: null});
    };

    public render() {
        const i18n = this.props.i18n;
        const resource = this.props.resource || {};
        const resourceTerms = resource.terms || [];
        return <div className='metadata-panel'>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('resource.metadata.identifier')}</Label>
                </Col>
                <Col md={10}>
                    <OutgoingLink iri={resource.iri} label={resource.iri}/>
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('resource.metadata.label')}</Label>
                </Col>
                <Col md={10}>
                    {resource.label}
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('resource.metadata.comment')}</Label>
                </Col>
                <Col md={10}>
                    {resource.comment}
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className='attribute-label'>{i18n('resource.metadata.terms')}</Label>
                </Col>
                <Col md={10}>
                    {resourceTerms.map(r => {
                        return <span key={r.iri} className='search-result-item search-result-link btn-link'
                                     title={this.props.i18n('search.results.item.term.tooltip')}
                                     onClick={this.openResult.bind(null, r)}>{r.label}</span>;
                    })}
                </Col>
            </Row>
        </div>;
    }
}

export default injectIntl(withI18n(ResourceMetadata));