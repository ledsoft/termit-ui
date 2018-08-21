import * as React from 'react';
import {injectIntl} from 'react-intl';
import {Card, CardBody, CardHeader, CardTitle, Row} from 'reactstrap';
import withI18n, {HasI18n} from '../hoc/withI18n';
import Vocabulary from "../../model/Vocabulary";

// @ts-ignore
import { IntelligentTreeSelect } from 'intelligent-tree-select';
import "intelligent-tree-select/lib/styles.css";

// @ts-ignore
import data from './../../util/__mocks__/generated-data.json' // TODO remove

// TODO The vocabulary will be required (or replaced by a tree of terms directly)
interface GlossaryTermsProps extends HasI18n {
    vocabulary?: Vocabulary
}

export class GlossaryTerms extends React.Component<GlossaryTermsProps> {

    public render() {

        function _fetchOptions({searchString, optionID, limit, offset}: any) {
            return new Promise((resolve) => {
                 // TODO fetch options from the server
                setTimeout(resolve, 1000, data)
            });
        }

        function _onOptionCreate({option}: any) {
            // TODO response callback
        }

        const i18n = this.props.i18n;
        return <Card>
            <CardHeader color="info">
                <CardTitle>{i18n('glossary.title')}</CardTitle>
            </CardHeader>
            <CardBody>
                <Row>
                        Glossary term tree
                        <IntelligentTreeSelect
                            // name={"main_search"}
                            fetchOptions={_fetchOptions}
                            valueKey={"value"}
                            labelKey={"label"}
                            childrenKey={"children"}
                            simpleTreeData={true}
                            isMenuOpen={true}
                            options={data}
                            onOptionCreate={_onOptionCreate}
                        />
                </Row>
            </CardBody>
        </Card>;

    }
}

export default injectIntl(withI18n(GlossaryTerms));