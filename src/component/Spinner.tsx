import * as React from "react";
import "./Spinner.scss";

export default class Spinner extends React.Component {

    public render() {
        return <div className="spinner_container spinner_fixed"><div className="spinner"/></div>;
    }

}
