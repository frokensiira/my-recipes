import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import RecipeCard from './RecipeCard';

const Home = () => {
    const { currentUser, loading } = useAuth();

    const [recipes, setRecipes] = useState([]);

    const getRecipes = async () => {
        const myRecipes = [];

        const snapshot = await db.collection('recipes').get();

        snapshot.forEach(doc => {
            myRecipes.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        setRecipes(myRecipes);
    }

    useEffect(() => {
        getRecipes();
    }, []);


    return (
        <>
            { loading 
                ? (<p>loading...</p>) 
                : (<p>You are signed up as <strong>{currentUser && currentUser.email}</strong></p>)
            }
            <main className="container mt-5">

                <div className="card-columns">
                    <h1>Alla recept</h1>
                    {
                    recipes.length !== 0 && (
                        recipes.map(recipe => 
                            <RecipeCard recipe={recipe} key={recipe.id}/>  
                        )
                    )
                }  
                            
                </div>
            </main> 
        </> 
    )
}

export default Home;
