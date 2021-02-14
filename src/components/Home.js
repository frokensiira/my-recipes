import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
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
                : currentUser ? 
                (<p>You are signed in as <strong>{currentUser && currentUser.email}</strong></p>)
                : ''
            }
            <section className="banner-section">
                <h1>My Veggie Recipes</h1>
                <p>Skapa och inspireras av nya vegetariska och veganska recept</p>
                <button><Link to={`/signup`} className="navbar__nav-link">Skapa konto</Link></button>
            </section>
            <main className="page">

                <h1 className="page__title">Alla recept</h1>
                <div className="cards">
                    
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
