import { useNavigate } from 'react-router-dom';
import foodPlaceholder from '../images/food_placeholder.png';

const RecipeCard = ({recipe}) => {
    const navigate = useNavigate();

    const handleClickRecipe = () => {
        navigate(`/my-recipes/${recipe.id}`, {state: {recipe}})
    }

    return (
        <div>
            <div className="card">

            {
                recipe.photoUrl 
                
                ? (<img src={recipe.photoUrl} className="card-img-top" alt={recipe.name}/>)
                : (<img src={foodPlaceholder} id="placeholder" className="card-img-top" alt="plate with cutlery"/>)
            }

                <div className="card-body">
                    <h5 className="card-title">{recipe.name}</h5>
                    <p className="card-text">{recipe.comment}</p>
                   
                    <button className="btn btn-lg btn-outline-secondary mx-4" onClick={handleClickRecipe}> Till receptet</button>

                </div>
            </div>
            
        </div>
    )
}

export default RecipeCard;
