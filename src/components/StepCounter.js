import React from "react";
import { Link } from "react-router-dom";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StepCounter = () => {
    return (
        <div className="page__text-wrapper">
            <Link to={`/my-recipes/create-recipe`}>
                <FontAwesomeIcon
                    className="page__text-icon"
                    icon={faChevronLeft}
                />
            </Link>
            <p className="page__text"> Steg 2 av 2</p>
        </div>
    );
};

export default StepCounter;
