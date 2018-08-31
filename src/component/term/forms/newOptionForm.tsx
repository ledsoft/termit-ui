// @ts-ignore
import {VirtualizedTreeSelect} from "intelligent-tree-select";
// @ts-ignore
import {asField, BasicText, Form, Scope} from 'informed';

import * as React from "react";
import {ChangeEvent, CSSProperties} from "react";
import {Button, Collapse, FormFeedback, FormGroup, Input, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {validateLengthMin3, validateLengthMin5, validateNotSameAsParent} from "./newOptionValidate";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../../hoc/withI18n";

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
                return props.onChange(e, props.fieldApi)
            }
            return props.fieldApi.setValue(e.target.value);
        }

        return (
            <FormGroup>
                <Input type={"text"} autoComplete={"off"} placeholder={props.label} {...attributes} onChange={_onChange}/>
                {fieldState.error ? (<FormFeedback style={{color: 'red'}}>{fieldState.error}</FormFeedback>) : null}
            </FormGroup>
        )
    }
);

const ErrorGroupText = asField(({fieldState, ...props}: any) => {
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
                return props.onChange(e, props.fieldApi)
            }
            return props.fieldApi.setValue(e.target.value);
        }

        return (
            <span>
        <Input type={"text"} autoComplete={"off"} placeholder={props.label} {...attributes} onChange={_onChange}/>
                {fieldState.error ? (<FormFeedback style={{color: 'red'}}>{fieldState.error}</FormFeedback>) : null}
      </span>
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

    return (
        <FormGroup>
            <VirtualizedTreeSelect
                onChange={_onChange}
                value={props.fieldApi.getValue()}
                {...props}
                style={fieldState.error ? {border: 'solid 1px red'} : null}
            />
            {fieldState.error ? (
                <FormFeedback style={{color: 'red', display: 'block'}}>{fieldState.error}</FormFeedback>) : null}
        </FormGroup>
    );
});

interface NewOptionFormProps extends HasI18n {
    labelKey: string,
    valueKey: string,
    childrenKey: string,
    onOptionCreate: any,
    toggleModal: any,
    options: any[],
}

interface NewOptionFormState {
    siblings: any[],
    modalAdvancedSectionVisible: boolean,
    optionUriValue: string,
}

class NewOptionForm extends React.Component<NewOptionFormProps, NewOptionFormState> {

    constructor(props: NewOptionFormProps) {
        super(props);

        this._createNewOption = this._createNewOption.bind(this);
        this.filterParentOptions = this.filterParentOptions.bind(this);
        this.filterChildrenOptions = this.filterChildrenOptions.bind(this);
        this.addSibling = this.addSibling.bind(this);
        this.removeSibling = this.removeSibling.bind(this);
        this.toggleAdvancedSection= this.toggleAdvancedSection.bind(this);
        this.getOptionUri = this.getOptionUri.bind(this);
        this.setOptionUri = this.setOptionUri.bind(this);

        this.state = {
            siblings: [],
            modalAdvancedSectionVisible: false,
            optionUriValue: '',
        }
    }

    private filterParentOptions(options: any[], filter: string, currentValues: any[]) {
        return options.filter(option => {
            const label = option[this.props.labelKey];
            return label.toLowerCase().indexOf(filter.toLowerCase()) !== -1
        })
    }

    private filterChildrenOptions(options: any[], filter: string, currentValues: any[]) {
        return options.filter(option => {
            const label = option[this.props.labelKey];
            return (label.toLowerCase().indexOf(filter.toLowerCase()) !== -1) && !option.parent
        })
    }

    private _getIDs(children: any[]) {
        if (!children) {
            return [];
        }
        const ids: any[] = JSON.parse(JSON.stringify(children));
        return ids.map(obj => obj[this.props.valueKey])
    }

    private _createNewOption(data: any) {

        let properties = {};
        if (data.siblings) {
            properties = data.siblings.reduce((parameters: { result: any, elem: any }) => {
                const {result, elem} = parameters;
                result[elem.key] = elem.value;
                return result;
            }, {});
        }

        const children = this._getIDs(data.childOptions);
        let parent = '';
        if (data.parentOption) {
            parent = data.parentOption[this.props.valueKey];
        }

        const option = {};
        option[this.props.valueKey] = data.optionURI;
        option[this.props.labelKey] = data.optionLabel;
        option[this.props.childrenKey] = children;
        // @ts-ignore
        option.parent = parent;
        if (data.optionDescription) {
            // @ts-ignore
            option.description = data.optionDescription;
        }

        Object.assign(option, properties);

        this.props.toggleModal();
        this.props.onOptionCreate(option);
    }

    private getOptionUri(e: ChangeEvent<HTMLInputElement>, fieldApi: any){
        fieldApi.setValue(e.target.value);

        const promise = null; // TODO fetch data

        // @ts-ignore
        promise.then((data: string) => {
            this.setOptionUri(data)
        })
    }

    private setOptionUri(newUri: string){
        this.setState({optionUriValue: newUri})
    }

    private toggleAdvancedSection() {
        return this.setState({modalAdvancedSectionVisible: !this.state.modalAdvancedSectionVisible});
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

    public render() {

        const i18n = this.props.i18n;

        // @ts-ignore
        const styles: CSSProperties = {pointer: 'cursor'};

        return (
            <Form id="new-option-form" onSubmit={this._createNewOption}>
                <ModalHeader toggle={this.props.toggleModal}>
                    {i18n('glossary.form.header')}
                </ModalHeader>

                <ModalBody>
                    <ErrorText field="optionLabel" id="optionLabel" label={i18n('glossary.form.field.label')}
                               validate={validateLengthMin5}
                               validateOnChange={true}
                               validateOnBlur={true}
                               onChange={this.getOptionUri}
                    />
                    <ErrorText field="optionURI" id="optionURI" label={i18n('glossary.form.field.uri')}
                               validate={validateLengthMin5}
                               validateOnChange={true}
                               validateOnBlur={true}
                               onChange={this.setOptionUri}
                               value={this.state.optionUriValue}
                    />
                    <TextInput field="optionDescription" id="optionDescription" label={i18n('glossary.form.field.description')}/>


                    <Button color="link"
                            onClick={this.toggleAdvancedSection}>
                        {(this.state.modalAdvancedSectionVisible ? i18n('glossary.form.button.hideAdvancedSection') : i18n('glossary.form.button.showAdvancedSection'))}
                    </Button>


                    <Collapse isOpen={this.state.modalAdvancedSectionVisible}>

                        <Select field={"parentOption"}
                                options={this.props.options}
                                multi={false}
                                placeholder={i18n('glossary.form.field.selectParent')}
                                labelKey={this.props.labelKey}
                                valueKey={this.props.valueKey}
                                childrenKey={this.props.childrenKey}
                                filterOptions={this.filterParentOptions}
                                expanded={true}
                                renderAsTree={false}
                        />

                        <Select field={"childOptions"}
                                options={this.props.options}
                                placeholder={i18n('glossary.form.field.selectChildren')}
                                multi={true}
                                labelKey={this.props.labelKey}
                                valueKey={this.props.valueKey}
                                childrenKey={this.props.childrenKey}
                                filterOptions={this.filterChildrenOptions}
                                expanded={true}
                                renderAsTree={false}
                                validate={validateNotSameAsParent}
                                validateOnChange={true}
                                validateOnBlur={true}
                        />

                        <FormGroup>
                            <Button type="button"
                                    onClick={this.addSibling}
                                    color={'primary'} size="sm">
                                {i18n('glossary.form.button.addProperty')}
                            </Button>
                            {this.state.siblings.map((member, index) => (
                                <FormGroup key={index}
                                           className={"d-flex justify-content-between align-items-center m-1"}>
                                    <Scope scope={`siblings[${index}]`}>

                                        <ErrorGroupText
                                            key={`label-${index}`}
                                            field="key"
                                            label={i18n('glossary.form.field.propertyKey')}
                                            validate={validateLengthMin3}
                                            validateOnChange={true}
                                            validateOnBlur={true}
                                        />
                                        <ErrorGroupText
                                            key={`value-${index}`}
                                            field="value"
                                            label={i18n('glossary.form.field.propertyValue')}
                                            validate={validateLengthMin3}
                                            validateOnChange={true}
                                            validateOnBlur={true}
                                        />
                                    </Scope>
                                    <span onClick={this.removeSibling} style={styles}
                                          data-index={index}
                                          className="Select-clear-zone"
                                          title={i18n('glossary.form.button.removeProperty')} aria-label={i18n('glossary.form.button.removeProperty')}>
                    <span className="Select-clear" style={{fontSize: 24 + 'px'}}>×</span>
                  </span>
                                </FormGroup>
                            ))}

                        </FormGroup>

                    </Collapse>
                </ModalBody>

                <ModalFooter>
                    <Button color="primary" type="submit">{i18n('glossary.form.button.submit')}</Button>{' '}
                    <Button color="secondary" type="button" onClick={this.props.toggleModal}>{i18n('glossary.form.button.cancel')}</Button>
                </ModalFooter>

            </Form>
        )

    }
}


export default injectIntl(withI18n(NewOptionForm));