import { Link, NavLink } from 'react-router-dom';


const Navbar = () => {
    return (

        <nav className="fixed top navbar navbar-dark bg-dark navbar-expand py-4">
			<div className="container">	
            	<Link to={`/`} className="navbar-brand" id="logo-text"><span role="img" aria-label="pot of food">🍲</span>Veggie Recipes</Link>

				<div className="navbar-collapse">
					<ul className="navbar-nav ml-auto pr-5">
						<li className="nav-item">
							<NavLink to={`/my-recipes/`} className="nav-link nav-links">Mina recept</NavLink>
						</li>
						<li className="nav-item">
							<NavLink to={`/create-recipe/`} className="nav-link nav-links">Skapa recept</NavLink>
						</li>
					</ul>
				</div>
			</div>
		</nav>

    )
}

export default Navbar;