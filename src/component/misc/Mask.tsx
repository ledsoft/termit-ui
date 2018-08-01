import * as React from 'react';
import classNames from "classnames";
import {ClipLoader} from "react-spinners";
import I18nStore from '../../store/I18nStore';
import './Mask.scss';

interface MaskProps {
    text?: string,
    withoutText?: boolean,
    classes?: string
}

const Mask: React.SFC<MaskProps> = (props) => {
    const containerClasses = classNames('spinner-container', {'without-text': props.withoutText});
    const text = props.text ? props.text : I18nStore.i18n('please-wait');
    return <div className={props.classes ? props.classes : 'mask'}>
        <div className={containerClasses}>
            <div style={{width: 32, height: 32, margin: 'auto'}}>
                <ClipLoader color='#337ab7' size={32}/>
            </div>
            {!props.withoutText && <div className='spinner-message'>{text}</div>}
        </div>
    </div>;
};

Mask.defaultProps = {
    classes: 'mask',
    withoutText: false
};

export default Mask;
