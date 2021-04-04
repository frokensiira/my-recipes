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

        if (recipe.photoUrl && recipe.fullPath) {
            //if user uploaded own image, add uploaded photo to database
            db.collection("recipes")
                .add({
                    owner: currentUser.uid,
                    ownerUsername: currentUser.displayName,
                    name: recipe.name,
                    url: recipe.url,
                    comment: recipe.comment,
                    path: recipe.fullPath,
                    photoUrl: recipe.photoUrl,
                    vegan: recipe.vegan,
                })
                .then(() => {
                    navigate("/my-recipes/");
                })
                .catch((err) => {
                    console.log("something went wrong", err);
                });
        } else {
            //if user chose the image from the url, add uploaded recipe to database
            db.collection("recipes")
                .add({
                    owner: currentUser.uid,
                    ownerUsername: currentUser.displayName,
                    name: recipe.name,
                    url: recipe.url,
                    comment: recipe.comment,
                    photoUrl: recipe.photoUrl,
                    vegan: recipe.vegan,
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