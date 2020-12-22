import { Routes, Route } from 'react-router-dom';
import './App.scss';
import Home from '../src/components/Home';
import Navbar from './components/Navbar';
import MyRecipes from './components/MyRecipes';
import ShowSingleRecipe from './components/ShowSingleRecipe';
import CreateRecipe from './components/CreateRecipe';
import CreateRecipeWithUrl from './components/CreateRecipeWithUrl';
import CreateRecipeWithPhoto from './components/CreateRecipeWithPhoto';


function App() {

	 
	return (
		<div className="App">
			<header className="App-header">
				<Navbar/>
			</header>

			<Routes>
				<Route path="/">
					<Home/>
				</Route>
			</Routes>

			<Routes>
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
			</Routes>
			
		</div>
	);
}

export default App;
