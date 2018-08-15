import * as React from 'react';
import {Button} from "react-bootstrap";
import './Dashboard.scss';

interface TileProps {
    text: string;
    title?: string;
    onClick: () => void;
}

const DashboardQuickAccessTile: React.SFC<TileProps> = props => {
    return <Button className='dashboard-quick-access-tile btn-primary btn' title={props.title} onClick={props.onClick}>
        {props.text}
    </Button>
};

export default DashboardQuickAccessTile;