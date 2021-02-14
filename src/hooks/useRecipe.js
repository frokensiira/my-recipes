import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const useRecipe = (recipeId) => {

    const [loading, setLoading] = useState(true);
    const [recipe, setRecipe] = useState([]);
    const { currentUser } = useAuth();

    useEffect(() => {

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