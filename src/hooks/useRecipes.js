import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

const useRecipes = () => {
    const [loading, setLoading] = useState(true);
    const [recipes, setRecipes] = useState([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        //subscribe to recipe snapshots from firebase to update component whenever something changes
        const unsubscribe = db
            .collection("recipes")
            .where("owner", "==", currentUser.uid)
            .orderBy("name")
            .onSnapshot((snapshot) => {
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
    }, [currentUser.uid]);

    return { recipes, loading };
};

export default useRecipes;
