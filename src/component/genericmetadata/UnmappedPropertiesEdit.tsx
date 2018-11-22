import * as React from "react";
import {injectIntl} from "react-intl";
import withI18n, {HasI18n} from "../hoc/withI18n";
import {Badge, Button, Col, Label, Row} from "reactstrap";
import {GoPlus, GoX} from "react-icons/go";
import OutgoingLink from "../misc/OutgoingLink";
import AssetLabel from "../misc/AssetLabel";
import CustomInput from "../misc/CustomInput";

interface UnmappedPropertiesEditProps extends HasI18n {
    properties: Map<string, string[]>;
    onChange: (properties: Map<string, string[]>) => void;
}

interface UnmappedPropertiesEditState {
    property: string;
    value: string;
}

export class UnmappedPropertiesEdit extends React.Component<UnmappedPropertiesEditProps, UnmappedPropertiesEditState> {
    constructor(props: UnmappedPropertiesEditProps) {
        super(props);
        this.state = {
            property: "",
            value: ""
        };
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

    private onAdd = () => {
        const newProperties = new Map(this.props.properties);
        if (newProperties.has(this.state.property)) {
            newProperties.get(this.state.property)!.push(this.state.value);
        } else {
            newProperties.set(this.state.property, [this.state.value]);
        }
        this.props.onChange(newProperties);
        this.setState({property: '', value: ''});
    };

    private isValid() {
        return this.state.property.length > 0 && this.state.value.length > 0;
    }

    public render() {
        const i18n = this.props.i18n;
        return <div>
            {this.renderExisting()}
            <Row>
                <Col xl={6} md={12}>
                    <CustomInput name="property" label={i18n("properties.edit.property")} value={this.state.property}
                                 onChange={this.onChange}/>
                </Col>
                <Col xl={5} md={11}>
                    <CustomInput name="value" label={i18n("properties.edit.value")} value={this.state.value}
                                 onChange={this.onChange} onKeyPress={this.onKeyPress}/>
                </Col>
                <Col md={1} className="form-group align-self-end">
                    <Button color="primary" size="sm" title={i18n("properties.edit.add.title")}
                            onClick={this.onAdd} disabled={!this.isValid()}><GoPlus/></Button>
                </Col>
            </Row>
        </div>;
    }

    private renderExisting() {
        const result: JSX.Element[] = [];
        this.props.properties.forEach((values, k) => {
            const items = values.map(v => <li key={v}>
                {v}
                <Badge color="danger" title={this.props.i18n("properties.edit.remove")}
                       className="term-edit-source-remove align-middle"
                       onClick={this.onRemove.bind(null, k, v)}><GoX/></Badge>
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
}

export default injectIntl(withI18n(UnmappedPropertiesEdit));
