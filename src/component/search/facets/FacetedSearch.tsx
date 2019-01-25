import * as React from "react";
import Facets from "./Facets";
import FacetedSearchResult from "./FacetedSearchResult";
import {Col} from "reactstrap";

export default () => <div>
    <div className='row'>
        <Col md={4}>
            <Facets/>
        </Col>
        <Col md={8}>
            <FacetedSearchResult/>
        </Col>
    </div>
</div>;
