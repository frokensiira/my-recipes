import { Routes, Route } from 'react-router-dom';
import './App.scss';
import CreateRecipe from './components/CreateRecipe';
import CreateRecipeWithPhoto from './components/CreateRecipeWithPhoto';
import CreateRecipeWithUrl from './components/CreateRecipeWithUrl';
import Home from '../src/components/Home';
//import Login from '../src/components/Login';
import MyRecipes from './components/MyRecipes';
import Navbar from './components/Navbar';
import NotFound from './components/NotFound';
import ShowSingleRecipe from './components/ShowSingleRecipe';
import SignUp from './components/SignUp';


function App() {

	 
	return (
		
		<div className="App">
			<header className="App-header">
				<Navbar/>
			</header>

			<div className="container py-3">
				<Routes>

					<Route path="/">
						<Home/>
					</Route>

					<Route path="/signup">
						<SignUp/>
					</Route>

					{/* <Route path="/login">
						<Login/>
					</Route> */}

					<Route path="/my-recipes/">

						<Route path="/">
							<MyRecipes/>
						</Route>

						<Route path="/:recipeId">
							<ShowSingleRecipe/>
						</Route>
					</Route>

					<Route path="/create-recipe/">
						
						<Route path="/">
							<CreateRecipe/>
						</Route>

						<Route path="/url/">
							<CreateRecipeWithUrl/>
						</Route>

						<Route path="/photo/">
							<CreateRecipeWithPhoto/>
						</Route>
						
					</Route>

					<Route path="*" element={<NotFound/>}/>
						
				</Routes>
			</div>
		</div>
	);
}

export default App;
