import * as React from 'react';
import {injectIntl} from 'react-intl';
import withI18n, {HasI18n} from '../hoc/withI18n';

class VocabularyList extends React.Component<HasI18n> {

    public render() {
        return <div>
            TODO - list of vocabularies
        </div>
    }
}
export default injectIntl(withI18n(VocabularyList));