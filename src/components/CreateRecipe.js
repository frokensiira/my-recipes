import { Link } from 'react-router-dom';

const CreateRecipe = () => {
    return (
        <div>
            <div>
                <Link to={`/my-recipes/create-recipe/url/`}>
                    Skapa recept med länk
                </Link>
                <Link to={`/my-recipes/create-recipe/photo/`}>
                    Skapa recept med foto
                </Link>
            </div>
        </div>
    )
}

export default CreateRecipe;
