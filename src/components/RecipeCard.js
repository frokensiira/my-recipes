import { useNavigate } from 'react-router-dom';
import foodPlaceholder from '../images/food_placeholder.png';

const RecipeCard = ({recipe}) => {
    const navigate = useNavigate();

    const handleClickRecipe = () => {
        navigate(`/my-recipes/${recipe.id}`, {state: {recipe}})
    }

    return (
        <div>
            <div className="">

            {
                recipe.photoUrl 
                
                ? (<img src={recipe.photoUrl} className="" alt={recipe.name}/>)
                : (<img src={foodPlaceholder} id="placeholder" className="" alt="plate with cutlery"/>)
            }

                <div className="">
                    <h5 className="card-title">{recipe.name}</h5>
                    <p className="card-text">{recipe.comment}</p>
                   
                    <button className="" onClick={handleClickRecipe}> Till receptet</button>

                </div>
            </div>
            
        </div>
    )
}

export default RecipeCard;
