import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

const useMyRecipes = (vegan) => {
    const [loading, setLoading] = useState(true);
    const [recipes, setRecipes] = useState([]);
    const [likedRecipes, setLikedRecipes] = useState([]);
    const { currentUser } = useAuth();
    console.log("currentUser", currentUser.uid);

    useEffect(() => {
        //get a list of all the recipes that the user likes
        db.collection("likes")
            .where("liker", "==", currentUser.uid)
            .get()
            .then((querySnapshot) => {
                const favouriteRecipes = [];
                querySnapshot.forEach((doc) => {
                    db.collection("recipes")
                        .doc(doc.data().recipeId)
                        .get()
                        .then((doc) => {
                            console.log("doc", doc.data());
                            favouriteRecipes.push({
                                id: doc.id,
                                ...doc.data(),
                            });

                            setLikedRecipes(favouriteRecipes);
                        });
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });

        let query = db
            .collection("recipes")
            .where("owner", "==", currentUser.uid);
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
    }, [currentUser.uid, vegan]);

    return { recipes, likedRecipes, loading };
};

export default useMyRecipes;

// import { useEffect, useState } from "react";
// import { db } from "../firebase";
// import { useAuth } from "../contexts/AuthContext";

// const useMyRecipes = (vegan) => {
//     const [loading, setLoading] = useState(true);
//     const [recipes, setRecipes] = useState([]);
//     const { currentUser } = useAuth();

//     useEffect(() => {
//         let query = db
//             .collection("recipes")
//             .where("owner", "==", currentUser.uid);
//         if (vegan) {
//             query = query.where("vegan", "==", true);
//         }

//         //subscribe to recipe snapshots from firebase to update component whenever something changes
//         const unsubscribe = query.orderBy("name").onSnapshot((snapshot) => {
//             setLoading(true);
//             const myRecipes = [];

//             snapshot.forEach((doc) => {
//                 myRecipes.push({
//                     id: doc.id,
//                     ...doc.data(),
//                 });
//             });

//             setLoading(false);
//             setRecipes(myRecipes);
//         });

//         return unsubscribe;
//     }, [currentUser.uid, vegan]);

//     return { recipes, loading };
// };

// export default useMyRecipes;
