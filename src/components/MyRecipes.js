import RecipeCard from './RecipeCard';
import useRecipes from '../hooks/useRecipes';


const MyRecipes = () => {

    const { recipes } = useRecipes();
    
    return (

        <>
            <h1 className="page__title">Mina recept</h1>
            <main className="cards">

                {
                    recipes.length !== 0 && (
                        recipes.map(recipe => 
                            <RecipeCard recipe={recipe} key={recipe.id}/>  
                        )
                    )
                }   

            </main> 
        </>

    )
}

export default MyRecipes;
