import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Badge, Button, Col, FormGroup, Label, Row} from "reactstrap";
import {GoPlus, GoX} from "react-icons/go";
// @ts-ignore
import {IntelligentTreeSelect} from "intelligent-tree-select";
import OutgoingLink from "../misc/OutgoingLink";
import AssetLabel from "../misc/AssetLabel";
import CustomInput from "../misc/CustomInput";
import {connect} from "react-redux";
import TermItState from "../../model/TermItState";
import {ThunkDispatch} from "../../util/Types";
import {createProperty, getProperties} from "../../action/AsyncActions";
import RdfsResource, {RdfsResourceData} from "../../model/RdfsResource";
import CreatePropertyForm from "./CreatePropertyForm";
import {clearProperties} from "../../action/SyncActions";

interface UnmappedPropertiesEditProps extends HasI18n {
    properties: Map<string, string[]>;
    onChange: (properties: Map<string, string[]>) => void;
    loadKnownProperties: () => void;
    knownProperties: RdfsResource[];
    createProperty: (property: RdfsResource) => void;
    clearProperties: () => void;
}

interface UnmappedPropertiesEditState {
    property: RdfsResource | null;
    value: string;
    schedulePropertiesReset: boolean;
}

export class UnmappedPropertiesEdit extends React.Component<UnmappedPropertiesEditProps, UnmappedPropertiesEditState> {
    constructor(props: UnmappedPropertiesEditProps) {
        super(props);
        this.state = {
            property: null,
            value: "",
            schedulePropertiesReset: false
        };
    }

    public componentDidMount() {
        this.props.loadKnownProperties();
    }

    public componentWillUnmount() {
        if (this.state.schedulePropertiesReset) {
            this.props.clearProperties();
        }
    }

    private onRemove = (property: string, value: string) => {
        const newProperties = new Map(this.props.properties);
        const propValues = newProperties.get(property)!;
        if (propValues.length === 1) {
            newProperties.delete(property);
        } else {
            propValues.splice(propValues.indexOf(value), 1);
        }
        this.props.onChange(newProperties);
    };

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const change = {};
        change[e.currentTarget.name] = e.currentTarget.value;
        this.setState(change);
    };

    private onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && this.isValid()) {
            this.onAdd();
        }
    };

    public onPropertySelect = (property: RdfsResource | null) => {
        this.setState({property});
    };

    private onAdd = () => {
        const newProperties = new Map(this.props.properties);
        if (newProperties.has(this.state.property!.iri)) {
            newProperties.get(this.state.property!.iri)!.push(this.state.value);
        } else {
            newProperties.set(this.state.property!.iri, [this.state.value]);
        }
        this.props.onChange(newProperties);
        this.setState({property: null, value: ""});
    };

    private isValid() {
        return this.state.property && this.state.value.length > 0;
    }

    private static valueRenderer(option: RdfsResource) {
        return option.label ? option.label : option.iri;
    }

    public onCreateProperty = (propertyData: RdfsResourceData) => {
        const property = new RdfsResource(propertyData);
        this.setState({schedulePropertiesReset: true, property});
        this.props.createProperty(property);
    };

    public render() {
        const i18n = this.props.i18n;
        return <div className="additional-metadata">
            {this.renderExisting()}
            <Row>
                <Col xl={6} md={12}>
                    {this.renderPropertyInput()}
                </Col>
                <Col xl={5} md={11} className="align-self-end">
                    <CustomInput name="value" label={i18n("properties.edit.value")} value={this.state.value}
                                 onChange={this.onChange} onKeyPress={this.onKeyPress}/>
                </Col>
                <Col md={1} className="form-group align-self-end">
                    <Button color="primary" size="sm" title={i18n("properties.edit.add.title")}
                            onClick={this.onAdd} disabled={!this.isValid()}><GoPlus/> {i18n("properties.edit.add.text")}</Button>
                </Col>
            </Row>
        </div>;
    }

    private renderExisting() {
        const result: JSX.Element[] = [];
        this.props.properties.forEach((values, k) => {
            const items = values.map(v => <li key={v}>
                {v}
                <Badge title={this.props.i18n("properties.edit.remove")}
                       className="term-edit-source-remove align-middle"
                       onClick={this.onRemove.bind(null, k, v)}><GoX/>{this.props.i18n("properties.edit.remove.text")}</Badge>
            </li>);

            result.push(<div key={k}>
                <div><OutgoingLink label={<Label className="attribute-label"><AssetLabel iri={k}/></Label>} iri={k}/>
                </div>
                <div>
                    <ul className="term-items">
                        {items}
                    </ul>
                </div>
            </div>);
        });
        return result;
    }

    private renderPropertyInput() {
        const options = this.props.knownProperties.map(p => p.label ? p : Object.assign(p, {label: p.iri}));
        return <FormGroup>
            <Label className="attribute-label">{this.props.i18n("properties.edit.property")}</Label>
            {this.props.knownProperties.length > 0 ? <IntelligentTreeSelect className="term-edit"
                                                                            value={this.state.property}
                                                                            onChange={this.onPropertySelect}
                                                                            childrenKey="children"
                                                                            valueKey="iri"
                                                                            labelKey="label"
                                                                            showSettings={true}
                                                                            maxHeight={150}
                                                                            multi={false}
                                                                            renderAsTree={false}
                                                                            simpleTreeData={true}
                                                                            options={options}
                                                                            onOptionCreate={this.onCreateProperty}
                                                                            openButtonLabel={this.props.i18n("properties.edit.new")}
                                                                            openButtonTooltipLabel={this.props.i18n("properties.edit.new")}
                                                                            formComponent={CreatePropertyForm}
                                                                            valueRenderer={UnmappedPropertiesEdit.valueRenderer}/> :
                <CustomInput disabled={true}/>}
        </FormGroup>
    }
}

export default connect((state: TermItState) => {
    return {
        knownProperties: state.properties,
        intl: state.intl // Pass intl in props to force UI re-render on language switch
    };
}, (dispatch: ThunkDispatch) => {
    return {
        loadKnownProperties: () => dispatch(getProperties()),
        createProperty: (property: RdfsResource) => dispatch(createProperty(property)),
        clearProperties: () => dispatch(clearProperties())
    }
})(injectIntl(withI18n(UnmappedPropertiesEdit)));
