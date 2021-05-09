import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const useCreateUrlRecipe = (recipe, submit) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();
    const navigate = useNavigate();    

    useEffect(() => {
        if (!submit) {           
            return;
        }        
        setLoading(true);
        db.collection("recipes")
            .add({
                owner: currentUser.uid,
                creator: currentUser.uid,
                creatorUsername: currentUser.displayName,
                name: recipe.name,
                url: recipe.url,
                comment: recipe.comment,
                ...(recipe.fullPathPhoto && { fullPathPhoto: recipe.fullPathPhoto }),
                photoUrl: recipe.photoUrl,
                vegan: recipe.vegan,
            })
            .then(() => {
                setLoading(false);
                setError(false);
                navigate("/my-recipes/");
            })
            .catch((err) => {
                setError(true);
                setLoading(false);
                console.error("something went wrong", err);
            });
    }, [submit]); // eslint-disable-line react-hooks/exhaustive-deps

    return { error, setError, loading, setLoading };
};

export default useCreateUrlRecipe;