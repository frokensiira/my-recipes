import { useNavigate } from 'react-router-dom';
import foodPlaceholder from '../images/food_placeholder.png';
import { Link } from 'react-router-dom';

const RecipeCard = ({recipe}) => {
    const navigate = useNavigate();

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
                   
                    <Link to={`/my-recipes/${recipe.id}`} className=""> Till receptet</Link>

                </div>
            </div>
            
        </div>
    )
}

export default RecipeCard;
