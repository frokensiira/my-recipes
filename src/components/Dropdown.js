import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import onClickOutside from "react-onclickoutside";
import { useAuth } from "../contexts/AuthContext";
import { ReactComponent as User } from "../assets/user.svg";

function Dropdown () {
    const { currentUser } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    Dropdown.handleClickOutside = () => setShowDropdown(false);
    return (
        <li className="navbar__nav-item navbar__nav-item-dropdown">
            <button
                className="navbar__profile-button"
                aria-expanded="false"
                onClick={() => setShowDropdown((prevState) => !prevState)}
            >
                <User className="navbar__profile-icon" />
                {currentUser && (
                    <p className="navbar__displayname">
                        {currentUser.displayName}
                    </p>
                )}
            </button>

            {showDropdown && (
                <ul className="navbar__dropdown">
                    <li className="navbar__nav-item--mobile">
                        <NavLink
                            to={`/my-recipes`}
                            className="navbar__nav-link"
                        >
                            Mina recept
                        </NavLink>
                    </li>
                    <li className="navbar__nav-item--mobile">
                        <NavLink
                            to={`/my-recipes/create-recipe`}
                            className="navbar__nav-link"
                        >
                            Skapa recept
                        </NavLink>
                    </li>
                    <li className="navbar__nav-item--mobile">
                        <NavLink to={`/logout`} className="navbar__nav-link">
                            Logga ut
                        </NavLink>
                    </li>
                </ul>
            )}
        </li>
    );
};

const clickOutsideConfig = {
    handleClickOutside: () => Dropdown.handleClickOutside,
};

export default onClickOutside(Dropdown, clickOutsideConfig);

