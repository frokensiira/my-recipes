import RecipeCard from './RecipeCard';
import useRecipes from '../hooks/useRecipes';


const MyRecipes = () => {

    const { recipes } = useRecipes();
    
    return (
        <main className="">

            <div className="">

            {
                recipes.length !== 0 && (
                    recipes.map(recipe => 
                        <RecipeCard recipe={recipe} key={recipe.id}/>  
                    )
                )
            }   

            </div>
        </main> 
    )
}

export default MyRecipes;
