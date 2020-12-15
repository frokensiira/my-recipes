import { useEffect, useState } from 'react';
import { db } from '../firebase';
import RecipeCard from './RecipeCard';

const MyRecipes = () => {

    const [recipes, setRecipes] = useState(null);

    const getRecipes = async () => {
        const myRecipes = [];

        const snapshot = await db.collection('recipes').get();

        snapshot.forEach(doc => {
            myRecipes.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        console.log('this is myRecipes', myRecipes);

        setRecipes(myRecipes);
    }

    useEffect(() => {
        getRecipes();
    }, [])
    
    return (
        <main className="container mt-5">

            <div className="card-columns">

            {
                recipes && (
                    recipes.map(recipe => 
                        <RecipeCard recipe={recipe} key={recipe.id}/>  
                    )
                )
            }   

            </div>
        </main> 
    )
}

export default MyRecipes;
