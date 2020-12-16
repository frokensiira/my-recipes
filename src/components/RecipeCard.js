import React from 'react';
import foodPlaceholder from '../images/food_placeholder.png';

const RecipeCard = ({recipe}) => {

    console.log('this is recipe', recipe);

    return (
        <div>
            <div className="card">

            {
                recipe.photoUrl 
                
                ? (<img src={recipe.photoUrl} className="card-img-top"/>)
                : (<img src={recipe.photoUrl} className="card-img-top" alt="plate with cutlery"/>)
            }

                <div className="card-body">
                    <h5 className="card-title">{recipe.name}</h5>
                    <p className="card-text">{recipe.comment}</p>
                    <a href={recipe.url} target="_blank" rel="noreferrer"
                    className="btn btn-primary">Till receptet</a>   
                </div>
            </div>
        </div>
    )
}

export default RecipeCard;
