import { useEffect, useState } from "react";
import { db } from "../firebase";

const useAllRecipes = (vegan) => {
    const [loading, setLoading] = useState(true);
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        let query = db.collection("recipes");
        if (vegan) {
            query = query.where("vegan", "==", true);
        }

        //subscribe to recipe snapshots from firebase to update component whenever something changes
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
    }, [vegan]);

    return { recipes, loading };
};

export default useAllRecipes;
