import RecipeCard from './RecipeCard';
import { db } from '../firebase';

const MyRecipes = () => {


    return (
        <main className="container mt-5">

            <div className="card-columns">

                <RecipeCard/>      

            </div>
        </main> 
    )
}

export default MyRecipes;
