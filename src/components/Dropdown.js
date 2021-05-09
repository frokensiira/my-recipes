import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { ReactComponent as HamburgerClosed } from "../assets/nav-closed.svg";
import { ReactComponent as HamburgerOpen } from "../assets/nav-open.svg";

function Dropdown() {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownList = useRef();

    const handleClickOutside = (e) => {        
        if (dropdownList.current && !dropdownList.current.contains(e.target)) {
            setShowDropdown(false);
        }
    };

    const handleClick = (e) => {
        setShowDropdown((prevState) => !prevState);
    };

    useEffect(() => {
        // add event listener when component mounts
        document.addEventListener("mousedown", handleClickOutside);
        // return function to be called when unmounted
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);

    return (
        <li className="navbar__nav-item navbar__dropdown-items" ref={dropdownList}>
            <button
                className="navbar__dropdown-button navbar__hamburger"
                aria-expanded="false"
                onClick={handleClick}
            >
                {showDropdown ? (
                    <HamburgerOpen/>
                ) : (
                    <HamburgerClosed/>
                )}
            </button>

            {showDropdown && (
                <div className="dropdown">
                <ul className="navbar__dropdown navbar__dropdown-menu" >
                    <li className="navbar__nav-item--mobile">
                        <NavLink
                            to={`/all-recipes`}
                            className="navbar__nav-link"
                            onClick={handleClick}
                        >
                            Alla recept
                        </NavLink>
                    </li>
                    <li className="navbar__nav-item--mobile">
                        <NavLink
                            to={`/my-recipes`}
                            className="navbar__nav-link"
                            onClick={handleClick}
                        >
                            Mina recept
                        </NavLink>
                    </li>
                    <li className="navbar__nav-item--mobile">
                        <NavLink
                            to={`/my-recipes/create-recipe`}
                            className="navbar__nav-link"
                            onClick={handleClick}
                        >
                            Skapa recept
                        </NavLink>
                    </li>
                </ul>
                </div>
            )}
        </li>
    );
}



export default Dropdown;