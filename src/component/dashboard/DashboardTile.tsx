import * as React from 'react';
import {Button} from "react-bootstrap";
import './Dashboard.scss';

interface TileProps {
    text: string;
    title?: string;
    onClick: () => void;
}
const DashboardTile : React.SFC<TileProps> = props => {
    return <Button className='dashboard-tile btn-primary btn'>
        {props.text}
    </Button>
};

export default DashboardTile;