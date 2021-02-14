import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
	const { currentUser } = useAuth();
	const [newClass, setNewClass] = useState('');

	/* console.log(currentUser); */

	const handleBurgerMenu = () => {
		if(newClass === '') {
			setNewClass('navbar--active');
		} else {
			setNewClass('');
		}
	}

    return (

        <nav className="navbar">
			<div>
				<Link to={`/`} onClick={handleBurgerMenu} className="navbar__logo">My Veggie Recipes</Link>
			</div>


			<ul className={`navbar__nav-items ${newClass}`}>
				<li className="navbar__nav-item">
					<NavLink to={`/`} onClick={handleBurgerMenu} className="navbar__nav-link">Alla recept</NavLink>
				</li>

				{currentUser 
					? (
						<>
							<li className="navbar__nav-item">
								<NavLink to={`/my-recipes`} onClick={handleBurgerMenu} className="navbar__nav-link">Mina recept</NavLink>
							</li>
							<li className="navbar__nav-item">
								<NavLink to={`/my-recipes/create-recipe`} onClick={handleBurgerMenu} className="navbar__nav-link">Skapa recept</NavLink>
							</li>
							<li className="navbar__nav-item">
								<NavLink to={`/logout`} onClick={handleBurgerMenu} className="navbar__nav-link">Logga ut</NavLink>
							</li>
						</>
					)
					: (
						<li className="navbar__nav-item">
							<NavLink to={`/login`} onClick={handleBurgerMenu} className="navbar__nav-link">Logga in</NavLink>
						</li>
					)
				}
				
			</ul>
			<div className="navbar__burger" onClick={handleBurgerMenu}>
				<div className="navbar__burger--line"></div>
				<div className="navbar__burger--line"></div>
				<div className="navbar__burger--line"></div>
			</div>

		</nav>

    )
}

export default Navbar;