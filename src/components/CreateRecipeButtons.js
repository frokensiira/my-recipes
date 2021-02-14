import { Link } from 'react-router-dom';

const CreateRecipeButtons = () => {
    return (  
        <div className="create-recipe">
            <Link className="create-recipe__link" to={`/my-recipes/create-recipe/url/`}>
                <button className="create-recipe__button">
                    Lägg in länk till ett recept
                </button>
            </Link>
            <Link className="create-recipe__link" to={`/my-recipes/create-recipe/file/`}>
                <button className="create-recipe__button">
                    Ladda upp receptfil
                </button>
            </Link>
        </div>
    );
}
 
export default CreateRecipeButtons;