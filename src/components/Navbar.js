import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ReactComponent as Logo } from "../assets/logo.svg";
import Dropdown from "./Dropdown";
import DropdownProfile from "./DropdownProfile";
import { ReactComponent as User } from "../assets/user.svg";

const Navbar = () => {
    const { currentUser } = useAuth();

    return (
        <nav className="navbar">
            <Link to={`/`} className="navbar__logo">
                <Logo />
                <p className="navbar__logotext">my veggie recipes</p>
            </Link>

            <ul className={`navbar__nav-items`}>
                {currentUser ? (
                    <>
                        <div className="navbar__nav">
                            <li className="navbar__nav-item">
                                <NavLink
                                    to={`/all-recipes`}
                                    className="navbar__nav-link"
                                >
                                    Alla recept
                                </NavLink>
                            </li>
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
                        <DropdownProfile />
                        <Dropdown />
                    </>
                ) : (
                    <li className="navbar__nav-item">
                        <NavLink to={`/login`} className="navbar__nav-link">
                            <User className="navbar__login-icon" />
                            Logga in
                        </NavLink>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;

// import React from "react";
// import { Link, NavLink } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import { ReactComponent as Logo } from "../assets/logo.svg";
// import Dropdown from "./Dropdown";
// import DropdownProfile from "./DropdownProfile";
// import { ReactComponent as User } from "../assets/user.svg";

// const Navbar = () => {
//     const { currentUser } = useAuth();

//     return (
//         <nav className="navbar">
//             <Link to={`/`} className="navbar__logo">
//                 <Logo />
//                 <p className="navbar__logotext">my veggie recipes</p>
//             </Link>

//             <ul className={`navbar__nav-items`}>
//                 {currentUser ? (
//                     <>
//                         <div className="navbar__nav">
//                             <li className="navbar__nav-item">
//                                 <NavLink
//                                     to={`/all-recipes`}
//                                     className="navbar__nav-link"
//                                 >
//                                     Alla recept
//                                 </NavLink>
//                             </li>
//                             <li className="navbar__nav-item">
//                                 <NavLink
//                                     to={`/my-recipes`}
//                                     className="navbar__nav-link"
//                                 >
//                                     Mina recept
//                                 </NavLink>
//                             </li>
//                             <li className="navbar__nav-item">
//                                 <NavLink
//                                     to={`/my-recipes/create-recipe`}
//                                     className="navbar__nav-link"
//                                 >
//                                     Skapa recept
//                                 </NavLink>
//                             </li>
//                         </div>
//                         <DropdownProfile />
//                         <Dropdown />
//                     </>
//                 ) : (
//                     <li className="navbar__nav-item">
//                         <NavLink to={`/login`} className="navbar__nav-link">
//                             <User className="navbar__login-icon" />
//                             Logga in
//                         </NavLink>
//                     </li>
//                 )}
//             </ul>
//         </nav>
//     );
// };

// export default Navbar;