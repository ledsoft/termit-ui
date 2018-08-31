import * as React from 'react';
import {injectIntl} from 'react-intl';
import {Card, CardBody, CardHeader, Row} from 'reactstrap';
import withI18n, {HasI18n} from '../hoc/withI18n';
import Vocabulary from "../../model/Vocabulary";
import NewOptionForm from './forms/newOptionForm'
// @ts-ignore
import {IntelligentTreeSelect} from 'intelligent-tree-select';
import "intelligent-tree-select/lib/styles.css";
// @ts-ignore
import data from './../../util/__mocks__/generated-data.json' // TODO remove

// TODO The vocabulary will be required (or replaced by a tree of terms directly)
interface GlossaryTermsProps extends HasI18n {
    vocabulary?: Vocabulary
}

export class GlossaryTerms extends React.Component<GlossaryTermsProps> {


    constructor(props: GlossaryTermsProps) {
        super(props);
        this._fetchOptions = this._fetchOptions.bind(this);
        this._onOptionCreate = this._onOptionCreate.bind(this);
        this._formComponent = this._formComponent.bind(this);
    }

    private _fetchOptions({searchString, optionID, limit, offset}: any) {
        return new Promise((resolve) => {
            // TODO fetch options from the server
            setTimeout(resolve, 1000, data)
        });
    }

    private _formComponent(props: any) {
        return <NewOptionForm {...props}/>
    }

    private _filterComponent(props: any) {
        return null
    }

    private _onOptionCreate({option}: any) {
        // TODO response callback
    }

    public render() {
        const i18n = this.props.i18n;
        return <Card>
            <CardHeader color="info">
                <h5>{i18n('glossary.title')}</h5>
            </CardHeader>
            <CardBody>
                <Row>
                    <IntelligentTreeSelect
                        // name={"main_search"}
                        fetchOptions={this._fetchOptions}
                        valueKey={"value"}
                        labelKey={"label"}
                        childrenKey={"children"}
                        openButtonLabel={i18n('glossary.form.header')}
                        openButtonTooltipLabel={i18n('glossary.form.tooltipLabel')}
                        simpleTreeData={true}
                        isMenuOpen={true}
                        options={data}
                        filterComponent={this._filterComponent}
                        formComponent={this._formComponent}
                        onOptionCreate={this._onOptionCreate}
                    />
                </Row>
            </CardBody>
        </Card>;

    }
}

export default injectIntl(withI18n(GlossaryTerms));