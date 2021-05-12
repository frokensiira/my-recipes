import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ReactComponent as User } from "../assets/user.svg";

function DropdownProfile() {
    const { currentUser } = useAuth();
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
        <li className="navbar__nav-item navbar__nav-item-dropdown" ref={dropdownList}>
            <button
                className="navbar__dropdown-button"
                aria-expanded="false"
                onClick={handleClick}
            >
                <User className="navbar__profile-icon" />
            </button>

            {showDropdown && (
                <ul className="navbar__dropdown navbar__dropdown-profile">
                    <li>
                        <NavLink
                            to={`/logout`}
                            onClick={handleClick}
                            className="navbar__nav-link"
                        >
                            Logga ut
                        </NavLink>
                    </li>
                </ul>
            )}
        </li>
    );
}

export default DropdownProfile;