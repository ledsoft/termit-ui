import * as React from "react";
import "./Spinner.scss";

export default class SpinnerPlaceholder extends React.Component {

    public render() {
        return <div className="spinner_container spinner_placeholder"><div className="spinner"/></div>;
    }

}
