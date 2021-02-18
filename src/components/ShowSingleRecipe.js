import foodPlaceholder from '../assets/images/food_placeholder.png';
import { useParams } from 'react-router-dom';
import useRecipe from '../hooks/useRecipe';
import { SRLWrapper } from 'simple-react-lightbox';

const ShowSingleRecipe = (props) => {

    const { recipeId } = useParams();
    const { recipe, loading } = useRecipe(recipeId);

    return (

        <>

            {
                loading
                ? ( <p>Laddar</p>)
                : (
                    <div className="recipe">       

                        {
                            recipe.photoUrl 
                            ? ( <img src={recipe.photoUrl } className="recipe__image" alt="food"/>)
                            : ( <img src={foodPlaceholder} className="" alt="plate"/>)
                        }

                        <div className="recipe__content">

                        <div>
                            <h1>{recipe.name}</h1>

                            {
                                recipe.comment && (
                                    <p className="recipe__text">{recipe.comment}</p>
                                )
                                
                            }
                            {
                                recipe.vegan && (<p>Veganskt</p>)
                            }
                        </div>

                            
                        {
                            recipe.recipeUrl && (
                                <div className="recipe__file">
                                    <SRLWrapper>
                                        <a href={recipe.recipeUrl} title="Visa recept" data-attribute="SRL">
                                            <img src={recipe.recipeUrl} className="recipe__file" alt="food"/>
                                        </a>
                                    </SRLWrapper>
                                </div>
                            )
                        }
                        

                        {
                            recipe.url && (
                                <div className="recipe__link">
                                    <a href={recipe.url} className="btn btn-primary" target="_blank" rel="noreferrer">Länk till receptet</a>
                                </div>
                            )
                        }
                           
                    </div>

                </div>
                )
            }
        
       

        </>
    )
}

export default ShowSingleRecipe;
