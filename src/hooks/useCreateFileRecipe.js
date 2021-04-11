import { db, storage } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const useCreateFileRecipe = (recipe, vegan, submit) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();
    const navigate = useNavigate();   

    useEffect(() => {
        if (!recipe || !submit) {
            return;
        }

        //add uploaded photo to database
        db.collection("recipes")
            .add({
                owner: currentUser.uid,
                creator: currentUser.uid,
                creatorUsername: currentUser.displayName,
                name: recipe.name,
                comment: recipe.comment,
                photoUrl: recipe.photoUrl,
                fullPathPhoto: recipe.fullPathPhoto,
                fileUrl: recipe.fileUrl,
                fullPathFile: recipe.fullPathFile,
                vegan,
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

export default useCreateFileRecipe;