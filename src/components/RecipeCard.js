import React from 'react';

const RecipeCard = ({recipe}) => {

    return (
        <div>
            <div className="card">
                <img src={recipe.photoUrl} className="card-img-top" alt="Indisk linsgryta"/>
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
