import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

const Loading = () => {
    return (
        <div className="loading">
            <ClipLoader color="var(--green)" />
        </div>
    );
};

export default Loading;
