import * as React from 'react';
import withI18n, {HasI18n} from "../hoc/withI18n";
import MessageModel from '../../model/Message';
import {injectIntl} from 'react-intl';
import {Alert} from "reactstrap";
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {dismissMessage} from "../../action/SyncActions";
import Constants from '../../util/Constants';
import Timer = NodeJS.Timer;

interface MessageProps extends HasI18n {
    message: MessageModel,
    dismissMessage: (message: MessageModel) => void
}

interface MessageState {
    open: boolean
}

export class Message extends React.Component<MessageProps, MessageState> {

    private timer: Timer;

    constructor(props: MessageProps) {
        super(props);
        this.state = {
            open: true
        };
    }

    public componentDidMount() {
        this.timer = setTimeout(() => {
            this.toggleAlert();
        }, Constants.MESSAGE_DISPLAY_TIMEOUT);
    }

    public componentWillUnmount() {
        clearTimeout(this.timer);
    }

    private toggleAlert = (): void => {
        this.setState({open: false});
        this.props.dismissMessage(this.props.message);
    };

    public render() {
        const message = this.props.message;
        return <Alert color='info' isOpen={this.state.open}
                      toggle={this.toggleAlert}>{message.messageId ? this.props.formatMessage(message.messageId, message.values) : message.message}</Alert>;
    }
}

export default connect(null, (dispatch: Dispatch) => {
    return {
        dismissMessage: (message: MessageModel) => dispatch(dismissMessage(message))
    }
})(injectIntl(withI18n(Message)));