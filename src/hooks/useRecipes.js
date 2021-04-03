import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

const useRecipes = (vegan) => {
    const [loading, setLoading] = useState(true);
    const [recipes, setRecipes] = useState([]);
    const { currentUser } = useAuth();
    console.log('vegan', vegan);
    

    useEffect(() => {
        
        let query = db.collection("recipes").where("owner", "==", currentUser.uid);
        if(vegan) {
            query = query.where("vegan", "==", true)
        }        
  
        //subscribe to recipe snapshots from firebase to update component whenever something changes
        const unsubscribe = query
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
    }, [currentUser.uid, vegan]);

    return { recipes, loading };
};

export default useRecipes;