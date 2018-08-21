import * as React from 'react';
import {Button} from "reactstrap";
import './Dashboard.scss';

interface TileProps {
    text: string;
    title?: string;
    onClick: () => void;
}

const DashboardQuickAccessTile: React.SFC<TileProps> = props => {
    return <Button color="primary" className='dashboard-quick-access-tile' title={props.title} onClick={props.onClick}>
        {props.text}
    </Button>
};

export default DashboardQuickAccessTile;