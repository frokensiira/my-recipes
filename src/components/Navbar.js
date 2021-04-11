import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { ReactComponent as User } from "../assets/user.svg";

const Navbar = () => {
    const { currentUser } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <nav className="navbar">
            <Link to={`/`} className="navbar__logo">
                <Logo />
                <p className="navbar__logotext">my veggie recipes</p>
            </Link>

            <ul className={`navbar__nav-items`}>
                {currentUser ? (
                    <>
                        <li className="navbar__nav-item">
                            <NavLink
                                to={`/all-recipes`}
                                className="navbar__nav-link"
                            >
                                Alla recept
                            </NavLink>
                        </li>
                        <div className="navbar__nav">
                            <li className="navbar__nav-item">
                                <NavLink
                                    to={`/my-recipes`}
                                    className="navbar__nav-link"
                                >
                                    Mina recept
                                </NavLink>
                            </li>
                            <li className="navbar__nav-item">
                                <NavLink
                                    to={`/my-recipes/create-recipe`}
                                    className="navbar__nav-link"
                                >
                                    Skapa recept
                                </NavLink>
                            </li>
                        </div>
                        <li className="navbar__nav-item navbar__nav-item-dropdown">
                            <button
                                className="navbar__profile-button"
                                aria-expanded="false"
                                onClick={() =>
                                    setShowDropdown((prevState) => !prevState)
                                }
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
                                    <li className="navbar__nav-item navbar__nav-item--mobile">
                                        <NavLink
                                            to={`/my-recipes`}
                                            className="navbar__nav-link"
                                        >
                                            Mina recept
                                        </NavLink>
                                    </li>
                                    <li className="navbar__nav-item navbar__nav-item--mobile">
                                        <NavLink
                                            to={`/my-recipes/create-recipe`}
                                            className="navbar__nav-link"
                                        >
                                            Skapa recept
                                        </NavLink>
                                    </li>
                                    <li className="navbar__nav-item">
                                        <NavLink
                                            to={`/logout`}
                                            className="navbar__nav-link"
                                        >
                                            Logga ut
                                        </NavLink>
                                    </li>
                                </ul>
                            )}
                        </li>
                    </>
                ) : (
                    <li className="navbar__nav-item">
                        <NavLink to={`/login`} className="navbar__nav-link">
                            <FontAwesomeIcon
                                icon={faUser}
                                className="form__icon"
                            />
                            Logga in
                        </NavLink>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
