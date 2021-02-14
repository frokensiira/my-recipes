import { Routes, Route } from 'react-router-dom';
import '../src/styles/app.css';
import SimpleReactLightbox from 'simple-react-lightbox';
import AccessDenied from './components/AccessDenied';
import AuthContextProvider from '../src/contexts/AuthContext';
import AuthRoute from '../src/components/AuthRoute';
import CreateRecipe from './components/CreateRecipe';
import CreateRecipeWithFile from './components/CreateRecipeWithFile';
import CreateRecipeWithUrl from './components/CreateRecipeWithUrl';
import Home from '../src/components/Home';
import Login from '../src/components/Login';
import Logout from '../src/components/Logout';
import MyRecipes from './components/MyRecipes';
import Navbar from './components/Navbar';
import NotFound from './components/NotFound';
import ShowSingleRecipe from './components/ShowSingleRecipe';
import SignUp from './components/SignUp';


function App() {

	return (
		<AuthContextProvider>
			<SimpleReactLightbox>
			<header>
				<Navbar/>
			</header>

			<div>
				<Routes>

					<Route path="/">
						<Home/>
					</Route>

					<Route path="/signup">
						<SignUp/>
					</Route>

					<Route path="/login">
						<Login/>
					</Route>

					<Route path="/logout">
						<Logout/>
					</Route>

					<AuthRoute path="/my-recipes">

						<Route path="/">
							<MyRecipes/>
						</Route>

						<Route path="/:recipeId">
							<ShowSingleRecipe/>
						</Route>
						
						<Route path="/create-recipe">
							<CreateRecipe/>
						</Route>

						<Route path="/create-recipe/url">
							<CreateRecipeWithUrl/>
						</Route>

						<Route path="/create-recipe/file">
							<CreateRecipeWithFile/>
						</Route>
						
					</AuthRoute>

					<Route path="/403">
						<AccessDenied/>
					</Route>

					<Route path="*" element={<NotFound/>}/>
						
				</Routes>
			</div>
			</SimpleReactLightbox>
		</AuthContextProvider>
	);
}

export default App;
