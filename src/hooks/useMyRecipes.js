import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

const useMyRecipes = (vegan) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        setError(false);     

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
            snapshot.forEach((doc) => {
                myRecipes.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            
            setLoading(false);
            setRecipes(myRecipes);
        });

        return unsubscribe;
    }, [currentUser.uid, vegan]);

    return { recipes, loading, error };
};

export default useMyRecipes;