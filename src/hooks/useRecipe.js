import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const useRecipe = (recipeId) => {

    const [loading, setLoading] = useState(true);
    const [recipe, setRecipe] = useState([]);
    // const [recipeTitle, setRecipeTitle] = useState('');
    const { currentUser } = useAuth();
    // const navigate = useNavigate();

    useEffect(() => {
        //subscribe to album snapshots from firebase to update component whenever something changes
        /* db.collection('recipes')
        .doc(recipeId)
        .get().then(doc => {

            console.log('this is doc', doc);
        }) */

        const unsubscribe = db.collection('recipes')
            .doc(recipeId)
            .onSnapshot(doc => {
                setLoading(true);

                console.log('recipe', doc.data());
                setLoading(false);
                setRecipe(doc.data());

            return unsubscribe;
        });

    }, [recipeId]);

    return { loading, setLoading, recipe };
}

export default useRecipe;