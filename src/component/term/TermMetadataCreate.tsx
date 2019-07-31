// @ts-ignore
import {IntelligentTreeSelect} from "intelligent-tree-select";
// @ts-ignore
import {asField, Form} from "informed";

import * as React from "react";
import {ChangeEvent} from "react";
import {
    Button,
    ButtonToolbar,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Collapse,
    FormFeedback,
    FormGroup,
    FormText,
    Input,
    Label,
    Row,
} from "reactstrap";
import {validateLengthMin3, validateLengthMin5, validateNotSameAsParent} from "./forms/newOptionValidate";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import Routing from "../../util/Routing";
import Routes from "../../util/Routes";
import {RouteComponentProps, withRouter} from "react-router";
import FetchOptionsFunction from "../../model/Functions";
import Ajax, {params} from "../../util/Ajax";
import Constants from "../../util/Constants";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import Term, {CONTEXT as TERM_CONTEXT} from "../../model/Term";
import {loadTerms} from "../../action/AsyncActions";
import {ThunkDispatch} from "../../util/Types";
import IntlData from "../../model/IntlData";
import Utils from "../../util/Utils";
import {IRI} from "../../util/VocabularyUtils";
import TextArea from "../misc/TextArea";

const ErrorText = asField(({fieldState, ...props}: any) => {
        const attributes = {};
        if (fieldState.touched) {
            if (fieldState.error) {
                // @ts-ignore
                attributes.invalid = true;
            } else {
                // @ts-ignore
                attributes.valid = true;
            }
        }

        function _onChange(e: ChangeEvent<HTMLInputElement>) {
            if (props.onChange) {
                return props.onChange(e.target.value, props.fieldApi)
            }
            return props.fieldApi.setValue(e.target.value);
        }

        if (props.value) {
            props.fieldApi.setValue(props.value);
        }

        return (
            <FormGroup>
                <Input name={props.name} type={"text"} autoComplete={"off"} placeholder={props.label} {...attributes}
                       onChange={_onChange} value={props.value}/>
                {fieldState.error ? (<FormFeedback style={{color: "red"}}>{fieldState.error}</FormFeedback>) : null}
                {props.help ? <FormText>{props.help}</FormText> : null}
            </FormGroup>
        )
    }
);

const TextInput = asField(({fieldState, ...props}: any) => {
        function _onChange(e: ChangeEvent<HTMLInputElement>) {
            if (props.onChange) {
                return props.onChange(e, props.fieldApi)
            }
            return props.fieldApi.setValue(e.target.value);
        }

        return (
            <FormGroup className={props.className}>
                <Input name={props.name} type={"text"} autoComplete={"off"} placeholder={props.label} onChange={_onChange}/>
                {props.children}
            </FormGroup>
        );
    }
);

const Select = asField(({fieldState, ...props}: any) => {
    function _onChange(value: any) {
        if (props.onChange) {
            return props.onChange(value, props.fieldApi)
        }
        return props.fieldApi.setValue(value);
    }

    return (
        <FormGroup>
            <IntelligentTreeSelect name={props.name}
                                   onChange={_onChange}
                                   value={props.fieldApi.getValue()}
                                   showSettings={false}
                                   maxHeight={150}
                                   fetchOptions={props.fetchOptions}
                                   valueRenderer={Utils.labelValueRenderer}
                                   {...props}
                                   style={fieldState.error ? {border: "solid 1px red"} : null}
            />
            {fieldState.error ? (
                <FormFeedback style={{color: "red", display: "block"}}>{fieldState.error}</FormFeedback>) : null}
        </FormGroup>
    );
});

interface TermMetadataCreateStoreProps {
    types: { [key: string]: Term };
    lang: string;
    intl: IntlData;
}

interface TermMetadataCreateDispatchProps {
    fetchTerms: (fetchOptions: FetchOptionsFunction, vocabularyIri: IRI) => void;
}

interface TermMetadataCreateOwnProps {
    onCreate: (term: Term, normalizedName: string) => void;
}

declare type TermMetadataCreateProps =
    TermMetadataCreateOwnProps
    & TermMetadataCreateStoreProps
    & TermMetadataCreateDispatchProps
    & HasI18n
    & RouteComponentProps<any>;

interface CreateVocabularyTermState {
    siblings: Term[];
    modalAdvancedSectionVisible: boolean;
    optionUriValue: string;
    comment: string;
    definition: string;
    generateUri: boolean;
}

interface NewOptionData {
    // siblings : Term[],
    typeOption: Term;
    optionURI: string;
    parentOption: Term;
    optionLabel: string;
    optionDescription: string;
    optionSource: string;
}

export class TermMetadataCreate extends React.Component<TermMetadataCreateProps, CreateVocabularyTermState> {

    constructor(props: TermMetadataCreateProps) {
        super(props);
        this.createNewOption = this.createNewOption.bind(this);
        this.filterParentOptions = this.filterParentOptions.bind(this);
        this.filterChildrenOptions = this.filterChildrenOptions.bind(this);
        this.addSibling = this.addSibling.bind(this);
        this.removeSibling = this.removeSibling.bind(this);
        this.toggleAdvancedSection = this.toggleAdvancedSection.bind(this);
        this.getOptionUri = this.getOptionUri.bind(this);
        this.setOptionUri = this.setOptionUri.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.validateLengthMin5 = this.validateLengthMin5.bind(this);
        this.validateLengthMin3 = this.validateLengthMin3.bind(this);
        this.validateNotSameAsParent = this.validateNotSameAsParent.bind(this);
        this.cancelCreation = this.cancelCreation.bind(this);
        this.fetchOptions = this.fetchOptions.bind(this);

        this.state = {
            siblings: [],
            modalAdvancedSectionVisible: false,
            optionUriValue: "",
            comment: "",
            definition: "",
            generateUri: true,
        }
    }

    private onDefinitionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({definition: e.currentTarget.value});
    };

    private onCommentChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({comment: e.currentTarget.value});
    };

    private cancelCreation() {
        const normalizedName = this.props.match.params.name;
        const namespace = Utils.extractQueryParam(this.props.location.search, "namespace");
        Routing.transitionTo(Routes.vocabularyDetail, {
            params: new Map([["name", normalizedName]]),
            query: namespace ? new Map([["namespace", namespace]]) : undefined
        });
    }

    private filterParentOptions(options: Term[], filter: string, currentValues: Term[]) {
        return options.filter(option => {
            const label = option.label;
            return label.toLowerCase().indexOf(filter.toLowerCase()) !== -1
        })
    }

    private filterChildrenOptions(options: Term[], filter: string, currentValues: Term[]) {
        return options.filter(option => {
            const label = option.label;
            return (label.toLowerCase().indexOf(filter.toLowerCase()) !== -1) && !option.parent
        })
    }

    private fetchOptions({searchString, optionID, limit, offset}: FetchOptionsFunction) {
        const namespace = Utils.extractQueryParam(this.props.location.search, "namespace");
        return this.props.fetchTerms({searchString, optionID, limit, offset}, {
            fragment: this.props.match.params.name,
            namespace
        });
    }

    private createNewOption(data: NewOptionData) {
        const parents = data.parentOption ? [data.parentOption as Term] : undefined;

        this.props.onCreate(new Term({
            iri: data.optionURI as string,
            label: data.optionLabel as string,
            definition: this.state.definition,
            comment: this.state.comment,
            parentTerms: parents,
            types: data.typeOption ? [data.typeOption.iri] : [],
            sources: [data.optionSource],
        }), this.props.match.params.name);
    }

    private handleOnChange(name: string) {
        this.setOptionUri(name, () => this.setState({generateUri: false}));
    }

    private getOptionUri(name: string, fieldApi: any) {
        fieldApi.setValue(name);
        if (this.state.generateUri && name.length > 4) {
            const normalizedName = this.props.match.params.name;
            Ajax.get(Constants.API_PREFIX + "/vocabularies/" + normalizedName + "/terms/identifier",
                params({name})).then(uri => this.setOptionUri(uri));
        }
    }

    private setOptionUri(newUri: string, callback: () => void = () => null) {
        this.setState({optionUriValue: newUri}, callback)
    }

    private toggleAdvancedSection() {
        this.setState({modalAdvancedSectionVisible: !this.state.modalAdvancedSectionVisible});
    }

    private removeSibling(event: React.MouseEvent<HTMLSpanElement>) {
        // @ts-ignore
        const index = parseInt(event.target.dataset.index, 10);
        this.setState(prevState => {
            // @ts-ignore
            const siblings = [...prevState.siblings];
            siblings.splice(index, 1);
            return {
                siblings
            };
        });
    }

    private addSibling() {
        this.setState((prevState: CreateVocabularyTermState): CreateVocabularyTermState => {
            // @ts-ignore
            return {siblings: [...prevState.siblings, {key: "", value: ""}]};
        });
    }

    public validateLengthMin5(value: any, values: any) {
        return validateLengthMin5(value, values, this.props.i18n);
    }

    public validateLengthMin3(value: any, values: any) {
        return validateLengthMin3(value, values, this.props.i18n);
    }

    public validateNotSameAsParent(value: any, values: any) {
        return validateNotSameAsParent(value, values, this.props.i18n, TERM_CONTEXT.iri);
    }

    public render() {
        const i18n = this.props.i18n;
        const types = this.props.types ? Object.keys(this.props.types).map(k => this.props.types[k]) : [];

        return <Card id="create-term">
            <CardHeader color="info">
                <CardTitle>{i18n("glossary.form.header")}</CardTitle>
            </CardHeader>
            <CardBody>
                <Form onSubmit={this.createNewOption}>
                    <Row>
                        <Col xl={6} md={12}>
                            <Label className="attribute-label">{i18n("asset.label")}</Label>
                            <ErrorText field="optionLabel" name="create-term-label"
                                       validate={this.validateLengthMin5}
                                       validateOnChange={true}
                                       validateOnBlur={true}
                                       onChange={this.getOptionUri}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={6} md={12}>
                            <Label className="attribute-label">{i18n("asset.iri")}</Label>
                            <ErrorText field="optionURI" name="create-term-iri"
                                       validate={this.validateLengthMin5}
                                       validateOnChange={true}
                                       help={i18n("asset.create.iri.help")}
                                       validateOnBlur={true}
                                       onChange={this.handleOnChange}
                                       value={this.state.optionUriValue}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={6} md={12}>
                            <TextArea name="create-term-definition" label={i18n("term.metadata.definition")}
                                      type="textarea" rows={3} value={this.state.definition} help={i18n("optional")}
                                      onChange={this.onDefinitionChange}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={6} md={12}>
                            <TextArea name="create-term-comment" label={i18n("term.metadata.comment")}
                                      type="textarea" rows={3} value={this.state.comment} help={i18n("optional")}
                                      onChange={this.onCommentChange}/>
                        </Col>
                    </Row>

                    <Row>
                        <Col xl={6} md={12}>
                            <Label className="attribute-label">{i18n("glossary.form.field.type")}</Label>
                            <Select field={"typeOption"}
                                    name={"create-term-types-" + this.props.match.params.name}
                                    options={types}
                                    multi={false}
                                    valueKey={"iri"}
                                    labelKey={"label"}
                                    childrenKey="subTerms"
                                    filterOptions={this.filterParentOptions}
                                    displayInfoOnHover={true}
                                    expanded={true}
                                    renderAsTree={true}
                            />
                        </Col>
                    </Row>

                    <Button color="link" id="create-term-toggle-advanced" onClick={this.toggleAdvancedSection}>
                        {this.state.modalAdvancedSectionVisible ? i18n("glossary.form.button.hideAdvancedSection") : i18n("glossary.form.button.showAdvancedSection")}
                    </Button>


                    <Collapse isOpen={this.state.modalAdvancedSectionVisible}>

                        <Row>
                            <Col xl={6} md={12}>
                                <Label className="attribute-label">{i18n("glossary.form.field.parent")}</Label>
                                <Select field={"parentOption"} id="create-term-parent"
                                        fetchOptions={this.fetchOptions}
                                        multi={false}
                                        valueKey={"iri"}
                                        labelKey={"label"}
                                        childrenKey="plainSubTerms"
                                        filterOptions={this.filterParentOptions}
                                        expanded={true}
                                        simpleTreeData={true}
                                        renderAsTree={true}
                                />
                            </Col>
                        </Row>

                        <Row>
                            <Col xl={6} md={12}>
                                <Label className="attribute-label">{i18n("glossary.form.field.source")}</Label>
                                <TextInput field="optionSource" name="create-term-source"/>
                            </Col>
                        </Row>
                    </Collapse>
                    <Row>
                        <Col xl={6} md={12}>
                            <ButtonToolbar className={"d-flex justify-content-end"}>
                                <Button id="create-term-submit" color="success" type="submit"
                                        size="sm">{i18n("glossary.form.button.submit")}</Button>
                                <Button id="create-term-cancel" color="secondary" size="sm"
                                        onClick={this.cancelCreation}>{i18n("glossary.form.button.cancel")}</Button>
                            </ButtonToolbar>
                        </Col>
                    </Row>
                </Form>
            </CardBody>
        </Card>;
    }

}

export default connect<TermMetadataCreateStoreProps, TermMetadataCreateDispatchProps, TermMetadataCreateOwnProps>((state: TermItState) => {
    return {
        intl: state.intl,
        types: state.types,
        lang: state.intl.locale
    };
}, (dispatch: ThunkDispatch) => {
    return {
        fetchTerms: (fetchOptions: FetchOptionsFunction, vocabularyIri: IRI) => dispatch(loadTerms(fetchOptions, vocabularyIri))
    };
})(withRouter(injectIntl(withI18n(TermMetadataCreate))));
