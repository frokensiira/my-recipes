import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const useCreateFileRecipe = (recipe, submit) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();
    const navigate = useNavigate();   

    useEffect(() => {
        if (!recipe || !submit) {
            return;
        }
        setLoading(true);
        //add uploaded photo to database
        db.collection("recipes")
            .add({
                owner: currentUser.uid,
                creator: currentUser.uid,
                creatorUsername: currentUser.displayName,
                name: recipe.name,
                comment: recipe.comment,
                photoUrl: recipe.photoUrl,
                fileName: recipe.fileName,
                fullPathPhoto: recipe.fullPathPhoto,
                fileUrl: recipe.fileUrl,
                fullPathFile: recipe.fullPathFile,
                vegan: recipe.vegan,
            })
            .then(() => {
                setLoading(false);
                setError(false);
                navigate("/my-recipes/");
            })
            .catch((error) => {
                setLoading(false);
                setError(true);
                console.error(error);
            });
    }, [submit]); // eslint-disable-line react-hooks/exhaustive-deps

    return { error, setError, loading, setLoading };
};

export default useCreateFileRecipe;