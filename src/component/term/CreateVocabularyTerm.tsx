// @ts-ignore
import {IntelligentTreeSelect} from "intelligent-tree-select";
// @ts-ignore
import {asField, BasicText, Form, Scope} from 'informed';

import * as React from "react";
import {ChangeEvent, CSSProperties} from "react";
import {
    Button,
    ButtonToolbar,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Collapse,
    FormFeedback,
    FormGroup,
    Input,
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
import {ThunkDispatch} from "redux-thunk";
import {Action} from "redux";
import VocabularyTerm, {CONTEXT as TERM_CONTEXT} from "../../model/VocabularyTerm";
import {createVocabularyTerm, fetchVocabularyTerms} from "../../action/ComplexActions";

const ErrorText = asField(({fieldState, ...props}: any) => {
        const attributes = {};
        if (fieldState.touched) {
            if (fieldState.error) {
                // @ts-ignore
                attributes.invalid = true;
            }
            else {
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
                <Input type={"text"} autoComplete={"off"} placeholder={props.label} {...attributes} onChange={_onChange}
                       value={props.value}/>
                {fieldState.error ? (<FormFeedback style={{color: 'red'}}>{fieldState.error}</FormFeedback>) : null}
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
            <FormGroup>
                <Input type={"text"} autoComplete={"off"} placeholder={props.label} onChange={_onChange}/>
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

    const valueRenderer = (option: any) => {
        return option.label
    };

    return (
        <FormGroup>
            <IntelligentTreeSelect
                onChange={_onChange}
                value={props.fieldApi.getValue()}
                showSettings={false}
                maxHeight={150}
                fetchOptions={props.fetchOptions}
                valueRenderer={valueRenderer}
                {...props}
                style={fieldState.error ? {border: 'solid 1px red'} : null}
            />
            {fieldState.error ? (
                <FormFeedback style={{color: 'red', display: 'block'}}>{fieldState.error}</FormFeedback>) : null}
        </FormGroup>
    );
});

interface CreateVocabularyTermProps extends HasI18n, RouteComponentProps<any> {
    options?: any[],
    fetchTerms: (fetchOptions: FetchOptionsFunction, normalizedName: string) => void,
    onCreate: (term: VocabularyTerm, normalizedName: string) => void
}

interface CreateVocabularyTermState {
    siblings: any[],
    modalAdvancedSectionVisible: boolean,
    optionUriValue: string,
    generateUri: boolean
}

export class CreateVocabularyTerm extends React.Component<CreateVocabularyTermProps, CreateVocabularyTermState> {

    constructor(props: CreateVocabularyTermProps) {
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
            optionUriValue: '',
            generateUri: true,
        }
    }

    private cancelCreation() {
        const normalizedName = this.props.match.params.name;
        Routing.transitionTo(Routes.vocabularyDetail, {params: new Map([['name', normalizedName]])});
    }

    private filterParentOptions(options: VocabularyTerm[], filter: string, currentValues: any[]) {
        return options.filter(option => {
            const label = option.label;
            return label.toLowerCase().indexOf(filter.toLowerCase()) !== -1
        })
    }

    private filterChildrenOptions(options: VocabularyTerm[], filter: string, currentValues: any[]) {
        return options.filter(option => {
            const label = option.label;
            return (label.toLowerCase().indexOf(filter.toLowerCase()) !== -1) && !option.parentTermUri
        })
    }

    private fetchOptions({searchString, optionID, limit, offset}: FetchOptionsFunction) {
        return this.props.fetchTerms({searchString, optionID, limit, offset}, this.props.match.params.name)
    }

    private _getIDs(children: VocabularyTerm[]): string[] {
        if (!children) {
            return [];
        }
        const ids: VocabularyTerm[] = JSON.parse(JSON.stringify(children));
        return ids.map(obj => obj.iri)
    }

    private createNewOption(data: any) {
        const children = this._getIDs(data.childOptions);
        let parent = '';
        if (data.parentOption as VocabularyTerm) {
            parent = data.parentOption.iri;
        }

        this.props.onCreate(new VocabularyTerm({
            iri: data.optionURI as string,
            label: data.optionLabel as string,
            comment: data.optionDescription as string,
            subTerms: children as string[],
            parentTermUri: parent as string
        }), this.props.match.params.name);
    }

    private handleOnChange(name: string) {
        this.setOptionUri(name, () => this.setState({generateUri: false}));
    }

    private getOptionUri(name: string, fieldApi: any) {
        fieldApi.setValue(name);
        if (this.state.generateUri && name.length > 4) {
            const normalizedName = this.props.match.params.name;
            Ajax.get(Constants.API_PREFIX + '/vocabularies/' + normalizedName + '/terms/identifier',
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
        this.setState(prevState => {
            // @ts-ignore
            return {siblings: [...prevState.siblings, {key: '', value: ''}]};
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
        // @ts-ignore
        const styles: CSSProperties = {pointer: 'cursor'};
        return (<Card>
            <CardHeader color='info'>
                <CardTitle>{i18n('glossary.form.header')}</CardTitle>
            </CardHeader>
            <CardBody>
                <Form onSubmit={this.createNewOption}>
                    <ErrorText field="optionLabel" id="optionLabel" label={i18n('glossary.form.field.label')}
                               validate={this.validateLengthMin5}
                               validateOnChange={true}
                               validateOnBlur={true}
                               onChange={this.getOptionUri}
                    />
                    <ErrorText field="optionURI" id="optionURI" label={i18n('glossary.form.field.uri')}
                               validate={this.validateLengthMin5}
                               validateOnChange={true}
                               validateOnBlur={true}
                               onChange={this.handleOnChange}
                               value={this.state.optionUriValue}
                    />
                    <TextInput field="optionDescription" id="optionDescription"
                               label={i18n('glossary.form.field.description')}/>


                    <Button color="link"
                            onClick={this.toggleAdvancedSection}>
                        {(this.state.modalAdvancedSectionVisible ? i18n('glossary.form.button.hideAdvancedSection') : i18n('glossary.form.button.showAdvancedSection'))}
                    </Button>


                    <Collapse isOpen={this.state.modalAdvancedSectionVisible}>

                        <Select field={"parentOption"}
                                options={this.props.options}
                                multi={false}
                                placeholder={i18n('glossary.form.field.selectParent')}
                                valueKey={"iri"}
                                labelKey={"label"}
                                childrenKey={"subTerms"}
                                filterOptions={this.filterParentOptions}
                                // fetchOptions={this.fetchOptions}
                                expanded={true}
                                renderAsTree={false}
                        />

                        <Select field={"childOptions"}
                                options={this.props.options}
                                placeholder={i18n('glossary.form.field.selectChildren')}
                                multi={true}
                                valueKey={"iri"}
                                labelKey={"label"}
                                childrenKey={"subTerms"}
                                filterOptions={this.filterChildrenOptions}
                                expanded={true}
                                // fetchOptions={this.fetchOptions}
                                renderAsTree={false}
                                validate={this.validateNotSameAsParent}
                                validateOnChange={true}
                                validateOnBlur={true}
                        />

                    </Collapse>
                    <ButtonToolbar className={'d-flex justify-content-end'}>
                        <Button color="primary" type="submit"
                                size="sm">{i18n('glossary.form.button.submit')}</Button>{' '}
                        <Button color="secondary" type="button" size="sm"
                                onClick={this.cancelCreation}>{i18n('glossary.form.button.cancel')}</Button>
                    </ButtonToolbar>
                </Form>
            </CardBody>
        </Card>);
    }

}

export default connect((state: TermItState) => {
    return {
        vocabulary: state.vocabulary
    };
}, (dispatch: ThunkDispatch<object, undefined, Action>) => {
    return {
        onCreate: (term: VocabularyTerm, normalizedName: string) => dispatch(createVocabularyTerm(term, normalizedName)),
        fetchTerms: (fetchOptions: FetchOptionsFunction, normalizedName: string) => dispatch(fetchVocabularyTerms(fetchOptions, normalizedName)),
    };
})(withRouter(injectIntl(withI18n(CreateVocabularyTerm))));