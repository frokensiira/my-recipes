import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import onClickOutside from "react-onclickoutside";
import { useAuth } from "../contexts/AuthContext";
import { ReactComponent as User } from "../assets/user.svg";

function DropdownProfile() {
    const { currentUser } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    DropdownProfile.handleClickOutside = () => setShowDropdown(false);

    const handleClick = () => {
        setShowDropdown((prevState) => !prevState);
    };
    return (
        <li className="navbar__nav-item navbar__nav-item-dropdown">
            <button
                className="navbar__profile-button"
                aria-expanded="false"
                onClick={handleClick}
            >
                <User className="navbar__profile-icon" />
                {currentUser && (
                    <p className="navbar__displayname">
                        {currentUser.displayName}
                    </p>
                )}
            </button>

            {showDropdown && (
                <ul className="navbar__dropdown navbar__dropdown-profile">
                    <li>
                        <NavLink to={`/logout`} className="navbar__nav-link">
                            Logga ut
                        </NavLink>
                    </li>
                </ul>
            )}
        </li>
    );
}

const clickOutsideConfig = {
    handleClickOutside: () => DropdownProfile.handleClickOutside,
};

export default onClickOutside(DropdownProfile, clickOutsideConfig);
