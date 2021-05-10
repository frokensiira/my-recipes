import React from "react";
import { ReactComponent as NotFoundImage } from "../assets/sad.svg";

const NotFound = () => {
    return (
        <div className="not-found">
            <pre><span>404</span></pre> 
            <pre>Page is missing</pre>
            <NotFoundImage/>
        </div>
    );
};

export default NotFound;
