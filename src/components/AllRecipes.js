import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";
import { db } from "../firebase";
import AddRecipeButton from "./AddRecipeButton";
import { ReactComponent as Broccoli } from "../assets/broccoli.svg";

const AllRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [vegan, setVegan] = useState(false);

    const getRecipes = async () => {
        const myRecipes = [];

        let snapshot;
        console.log('vegan', vegan);
        

        if(vegan) {
            snapshot = await db
            .collection("recipes")
            .where("vegan", "==", true)
            .get();
        } else {
            snapshot = await db.collection("recipes").get();
        }

        snapshot.forEach((doc) => {
            myRecipes.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        setRecipes(myRecipes);
    };

    useEffect(() => {
        getRecipes();
    }, [vegan]);

    const handleFilterSearch = (e) => {
        if (e.target.id === "vegan") {
            setVegan(true);
        } else {
            setVegan(false);
        }
    };

    return (
        <>
            <h1 className="page__title">
                Recept <Broccoli className="icon" />
            </h1>
            <ul className="filter">

                <li className="filter__item" onClick={handleFilterSearch}>
                    Alla
                </li>
                <li
                    className="filter__item"
                    id="vegan"
                    onClick={handleFilterSearch}
                >
                    Veganska
                </li>
            </ul>
            <div className="cards">
                {recipes.length !== 0 &&
                    recipes.map((recipe) => (
                        <RecipeCard recipe={recipe} key={recipe.id} />
                    ))}
            </div>
            <AddRecipeButton />
        </>
    );
};

export default AllRecipes;

// import React, { useEffect, useState } from "react";
// import RecipeCard from "./RecipeCard";
// import { db } from "../firebase";
// import AddRecipeButton from "./AddRecipeButton";
// import { ReactComponent as Broccoli } from "../assets/broccoli.svg";

// const AllRecipes = () => {
//     const [recipes, setRecipes] = useState([]);
//     const [active, setActive] = useState('all');

//     const getRecipes = async () => {
//         const myRecipes = [];

//         const snapshot = await db.collection("recipes").get();

//         snapshot.forEach((doc) => {
//             myRecipes.push({
//                 id: doc.id,
//                 ...doc.data(),
//             });
//         });

//         setRecipes(myRecipes);
//     };

//     useEffect(() => {
//         getRecipes();
//     }, []);

//     const getVeganRecipes = async () => {
//         const myRecipes = [];

//         const snapshot = await db
//             .collection("recipes")
//             .where("vegan", "==", true)
//             .get();

//         snapshot.forEach((doc) => {
//             myRecipes.push({
//                 id: doc.id,
//                 ...doc.data(),
//             });
//         });

//         setRecipes(myRecipes);
//     };

//     const handleFilterSearch = (e) => {
//         if (e.target.id === "vegan") {
//             getVeganRecipes();
//         } else {
//             getRecipes();
//         }
//     };

//     return (
//         <>
//             <h1 className="page__title">
//                 Recept <Broccoli className="icon" />
//             </h1>
//             <ul className="filter">
//                 <li className="filter__item" onClick={handleFilterSearch}>
//                     Alla
//                 </li>
//                 <li
//                     className="filter__item"
//                     id="vegan"
//                     onClick={handleFilterSearch}
//                 >
//                     Veganska
//                 </li>
//             </ul>
//             <div className="cards">
//                 {recipes.length !== 0 &&
//                     recipes.map((recipe) => (
//                         <RecipeCard recipe={recipe} key={recipe.id} />
//                     ))}
//             </div>
//             <AddRecipeButton />
//         </>
//     );
// };

// export default AllRecipes;
