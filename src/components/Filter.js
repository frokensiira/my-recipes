import React from "react";

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

// import React from "react";

// const Filter = ({vegan, handleFilterSearch}) => {

//     return (
//         <ul className="filter">
//             <li
//                 className={`filter__item ${
//                     !vegan ? "filter__item--active" : ""
//                 }`}
//                 onClick={handleFilterSearch}
//             >
//                 Alla
//             </li>
//             <li
//                 className={`filter__item ${
//                     vegan ? "filter__item--active" : ""
//                 }`}
//                 id="vegan"
//                 onClick={handleFilterSearch}
//             >
//                 Veganska
//             </li>
//         </ul>
//     );
// };

// export default Filter;
