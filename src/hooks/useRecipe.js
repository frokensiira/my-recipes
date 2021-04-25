import { useEffect, useState } from "react";
import { db } from "../firebase";

const useRecipe = (recipeId) => {
    const [loading, setLoading] = useState(true);
    const [recipe, setRecipe] = useState([]);
    
    useEffect(() => {      
        setLoading(true);
        const unsubscribe = db
            .collection("recipes")
            .doc(recipeId)
            .onSnapshot((doc) => {
                setLoading(false);
                setRecipe(doc.data());                
                return unsubscribe;
            });
    }, [recipeId]);

    return { loading, setLoading, recipe };
};

export default useRecipe;
