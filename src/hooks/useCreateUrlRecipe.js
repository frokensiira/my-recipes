import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const useCreateUrlRecipe = (recipe, submit) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    console.log('recipe', recipe);
    

    useEffect(() => {
        if (!submit) {
            return;
        }

        db.collection("recipes")
            .add({
                owner: currentUser.uid,
                creator: currentUser.uid,
                creatorUsername: currentUser.displayName,
                name: recipe.name,
                url: recipe.url,
                comment: recipe.comment,
                ...(recipe.fullPathPhoto && { path: recipe.fullPathPhoto }),
                photoUrl: recipe.photoUrl,
                vegan: recipe.vegan,
            })
            .then(() => {
                navigate("/my-recipes/");
            })
            .catch((err) => {
                console.log("something went wrong", err);
            });
    }, [submit]);

    return { error, loading };
};

export default useCreateUrlRecipe;