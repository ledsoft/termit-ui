import * as React from 'react';
import {Button} from "reactstrap";
import './Dashboard.scss';

interface TileProps {
    text: string;
    title?: string;
    onClick: () => void;
}

const DashboardTile: React.SFC<TileProps> = props => {
    return <Button color="primary" className='dashboard-tile' title={props.title} onClick={props.onClick}>
        {props.text}
    </Button>;
};

export default DashboardTile;