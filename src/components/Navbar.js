import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
	const { currentUser } = useAuth();

    return (

        <nav className="navbar">
			<div>
				<Link to={`/`} className="navbar__logo">My Veggie Recipes</Link>
			</div>


			<ul className={`navbar__nav-items`}>
				<li className="navbar__nav-item">
					<NavLink to={`/`} className="navbar__nav-link">Alla recept</NavLink>
				</li>

				{currentUser 
					? (
						<>
							<li className="navbar__nav-item">
								<NavLink to={`/my-recipes`} className="navbar__nav-link">Mina recept</NavLink>
							</li>
							<li className="navbar__nav-item">
								<NavLink to={`/my-recipes/create-recipe`} className="navbar__nav-link">Skapa recept</NavLink>
							</li>
							<button className="navbar__profile-button" aria-expanded="false">
								<FontAwesomeIcon icon={faUserCircle} />
								<FontAwesomeIcon icon={faSortDown} />
							</button>
							<ul className="navbar__dropdown">
								<li className="navbar__nav-item">
									<NavLink to={`/logout`} className="navbar__nav-link">Logga ut</NavLink>
								</li>
							</ul>
							
						</>
					)
					: (
						<li className="navbar__nav-item">
							<NavLink to={`/login`} className="navbar__nav-link">
								<FontAwesomeIcon icon={faUser} className="form__icon"/>
								Logga in
							</NavLink>
						</li>
					)
				}
				
			</ul>

		</nav>

    )
}

export default Navbar;