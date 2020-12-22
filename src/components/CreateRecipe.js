import { Link } from 'react-router-dom';

const CreateRecipe = () => {
    return (
        <div className="container my-5 d-flex align-items-center">
            <div className="container my-5 d-flex justify-content-center">
                <Link to={`/create-recipe/url/`} className="btn btn-lg btn-outline-secondary mx-4">
                    Skapa recept med länk
                </Link>
                <Link to={`/create-recipe/photo/`} className="btn btn-lg btn-outline-secondary mx-4">
                    Skapa recept med foto
                </Link>
            </div>
        </div>
    )
}

export default CreateRecipe;
