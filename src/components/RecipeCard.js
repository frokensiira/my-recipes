import { useNavigate } from 'react-router-dom';
import foodPlaceholder from '../images/food_placeholder.png';
import { Link } from 'react-router-dom';

const RecipeCard = ({recipe}) => {
    const navigate = useNavigate();

    return (

        <div className="card">

            {
                recipe.photoUrl 
                
                ? (<img src={recipe.photoUrl} className="card__image" alt={recipe.name}/>)
                : (<img src={foodPlaceholder} id="placeholder" className="" alt="plate with cutlery"/>)
            }

            <div className="card__content">
                <h1 className="card-title">{recipe.name}</h1>
                <p className="card-text">{recipe.comment}</p>

                {
                    recipe.vegan && (<p>Veganskt</p>)      
                }
                
                <Link to={`/my-recipes/${recipe.id}`} className=""> Till receptet</Link>

            </div>
        </div>
            

    )
}

export default RecipeCard;
