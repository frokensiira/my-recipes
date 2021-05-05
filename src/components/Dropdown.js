import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import onClickOutside from "react-onclickoutside";
import { ReactComponent as HamburgerClosed } from "../assets/nav-closed.svg";
import { ReactComponent as HamburgerOpen } from "../assets/nav-open.svg";

function Dropdown() {
    const [showDropdown, setShowDropdown] = useState(false);
    Dropdown.handleClickOutside = () => setShowDropdown(false);

    const handleClick = () => {
        setShowDropdown((prevState) => !prevState);
    };

    return (
        <li className="navbar__nav-item navbar__nav-item-dropdown navbar__dropdown-items">
            <button
                className="navbar__profile-button"
                aria-expanded="false"
                onClick={handleClick}
            >
                {showDropdown ? (
                    <HamburgerOpen className="navbar__hamburger navbar__hamburger--closed" />
                ) : (
                    <HamburgerClosed className="navbar__hamburger navbar__hamburger--closed" />
                )}
            </button>

            {showDropdown && (
                <ul className="navbar__dropdown navbar__dropdown-menu">
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
            )}
        </li>
    );
}

const clickOutsideConfig = {
    handleClickOutside: () => Dropdown.handleClickOutside,
};

export default onClickOutside(Dropdown, clickOutsideConfig);