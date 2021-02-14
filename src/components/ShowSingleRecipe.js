import foodPlaceholder from '../images/food_placeholder.png';
import { useLocation } from 'react-router-dom';

const ShowSingleRecipe = (props) => {

    const location = useLocation();

    console.log('this is location.state.recipe', location.state.recipe);
    const { name } = location.state.recipe;

    return (
        <div className="">
            <h1>{name}</h1>

            {
                location.state.recipe.photoUrl 
                ? ( <img src={location.state.recipe.photoUrl } className="w-50 p-3 img-thumbnail" alt="food"/>)
                : ( <img src={foodPlaceholder} className="w-50 p-3 img-thumbnail" alt="plate"/>)
            }
           

            {
                location.state.recipe.url && (
                    <div class="">
                        <a href={location.state.recipe.url} className="btn btn-primary" target="_blank" rel="noreferrer">Länk till receptet</a>
                    </div>
                )
            }
            {
                location.state.recipe.comment && (
                    <div className="">
                        <p id="recipe-text">Kommentar</p>
                        <p>{location.state.recipe.comment}</p>
                    </div>
                )
                
            }
            
        </div>
    )
}

export default ShowSingleRecipe;
