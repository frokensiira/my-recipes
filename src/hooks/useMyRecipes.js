import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

const useMyRecipes = (vegan, disLiked) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [recipes, setRecipes] = useState([]);
    const { currentUser } = useAuth();

    const likedRecipeList = [];

    const getLikedRecipes = async () => {
        const favouriteRecipes = [];       

        const promises = likedRecipeList.map(async (doc) => {            
            
            const recipeDoc = await db
                .collection("recipes")
                .doc(doc.recipeId)
                .get();

                //check if the user wants to see vegan recipes
                //return if the liked recipe is not vegan 
                if (!recipeDoc.data().vegan && vegan) {
                    return;
                } else {
                    favouriteRecipes.push({
                        id: recipeDoc.id,
                        ...recipeDoc.data(),
                    });
                }

                return new Promise((resolve, reject) => resolve(recipeDoc))
        });

        Promise.all(promises)
            .then(() => {
                console.log('favouriteRecipes', favouriteRecipes);
                
                setRecipes((prevRecipes) => [
                    ...prevRecipes,
                    ...favouriteRecipes,
                ]);
            }).catch (error => {
                setError(error);
                console.error(error);
            });
    };

    useEffect(() => {
        setRecipes([]);
        //get a list of all the recipes that the user likes

        db.collection("likes")
            .where("liker", "==", currentUser.uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach(doc => {
                    likedRecipeList.push({
                        ...doc.data()
                    });
                })
                getLikedRecipes();
            })
            .catch((error) => {
                setError(error);
                console.error(error);
            });

        let query = db
            .collection("recipes")
            .where("owner", "==", currentUser.uid);
        if (vegan) {
            query = query.where("vegan", "==", true);
        }

        //subscribe to the users own created recipes
        const unsubscribe = query.orderBy("name").onSnapshot((snapshot) => {
            setLoading(true);
            const myRecipes = [];

            //console.log('likedRecipes', likedRecipes);
            snapshot.forEach((doc) => {
                myRecipes.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });

            setLoading(false);
            setRecipes((prevRecipes) => [...prevRecipes, ...myRecipes]);
        });

        return unsubscribe;
    }, [currentUser.uid, vegan, disLiked]);

    return { recipes, loading };
};

export default useMyRecipes;