import React, { useEffect, useState } from "react";
import { db } from "../firebase";

const Filter = ({vegan, handleFilterSearch}) => {

    return (
        <ul className="filter">
            <li
                className={`filter__item ${
                    !vegan ? "filter__item--active" : ""
                }`}
                onClick={handleFilterSearch}
            >
                Alla
            </li>
            <li
                className={`filter__item ${
                    vegan ? "filter__item--active" : ""
                }`}
                id="vegan"
                onClick={handleFilterSearch}
            >
                Veganska
            </li>
        </ul>
    );
};

export default Filter;
