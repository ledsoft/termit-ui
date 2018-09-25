import * as React from 'react';
import File from "../../model/File";
import {Link} from "react-router-dom";

interface FileLinkProps {
    file: File
}

export default (props : FileLinkProps) => <div>
    <Link to={"/file/" + props.file.fileName}>
        {props.file.fileName}
    </Link>
</div>
