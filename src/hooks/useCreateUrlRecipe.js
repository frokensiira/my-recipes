import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const useCreateUrlRecipe = (recipe, photoUrl, fullPath, vegan, submit) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!submit) {
            return;
        }

        if (photoUrl && fullPath) {
            //add uploaded photo to database
            db.collection("recipes")
                .add({
                    owner: currentUser.uid,
                    name: recipe.name,
                    url: recipe.url,
                    comment: recipe.comment,
                    path: fullPath,
                    photoUrl: photoUrl,
                    vegan: vegan,
                })
                .then(() => {
                    navigate("/my-recipes/");
                })
                .catch((err) => {
                    console.log("something went wrong", err);
                });
        } else {
            //add uploaded recipe to database
            db.collection("recipes")
                .add({
                    owner: currentUser.uid,
                    name: recipe.name,
                    url: recipe.url,
                    comment: recipe.comment,
                    photoUrl: recipe.photoUrl,
                    vegan: vegan,
                })
                .then(() => {
                    navigate("/my-recipes/");
                })
                .catch((err) => {
                    console.log("something went wrong", err);
                });
        }
    }, [submit]);

    return { error, loading };
};

export default useCreateUrlRecipe;
