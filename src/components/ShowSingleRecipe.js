import foodPlaceholder from '../images/food_placeholder.png';
import { useParams } from 'react-router-dom';
import useRecipe from '../hooks/useRecipe';

const ShowSingleRecipe = (props) => {

    const { recipeId } = useParams();
    const { recipe, loading } = useRecipe(recipeId);

    return (
        <div className="">
        
            <h1>{recipe.name}</h1>

            {
                recipe.photoUrl 
                ? ( <img src={recipe.photoUrl } className="" alt="food"/>)
                : ( <img src={foodPlaceholder} className="" alt="plate"/>)
            }
           

            {
                recipe.url && (
                    <div className="">
                        <a href={recipe.url} className="btn btn-primary" target="_blank" rel="noreferrer">Länk till receptet</a>
                    </div>
                )
            }
            {
                recipe.comment && (
                    <div className="">
                        <p id="recipe-text">Kommentar</p>
                        <p>{recipe.comment}</p>
                    </div>
                )
                
            }
            
        </div>
    )
}

export default ShowSingleRecipe;
