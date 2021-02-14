import { db, storage } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const useCreateFileRecipe = (recipe, photo, file, vegan, submit) => {

    const [error, setError ] = useState(null);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {

        if(!recipe) {
            return;
        }

        //get root reference
        const storageRef = storage.ref();

        //create a reference based on the files name
        const fileRef = storageRef.child(`files/${file.name}`);

        //upload file to fileRef
        fileRef.put(file)
            .then(snapshot => {

                //retrieve url to uploaded file
                snapshot.ref.getDownloadURL().then(url => {

                    const fileUrl = url;

                    if(photo) {
                        //create a reference based on the photos name
                        const photoRef = storageRef.child(`photos/${photo.name}`);

                        //upload file to fileRef
                        photoRef.put(photo)
                            .then(snapshot => {
                                //retrieve url to uploaded photo
                                snapshot.ref.getDownloadURL().then(url => {
                                    console.log('this is fileUrl', fileUrl);

                                //add uploaded photo to database
                                db.collection('recipes').add({
                                    owner: currentUser.uid,
                                    name: recipe.name,
                                    comment: recipe.comment,
                                    path: snapshot.ref.fullPath,
                                    photoUrl: url, 
                                    recipeUrl: fileUrl,
                                    vegan
                                })
                                    .then(() => {
                                        navigate('/my-recipes/')
                                    })
                                    .catch(err => {
                                        console.log('something went wrong', err);
                                    })

                                })
                            })
                            .catch(err => {
                                console.log('problem uploading photo', err);
                            })
                    } else {
                        //add uploaded recipe to database
                        db.collection('recipes').add({
                            owner: currentUser.uid,
                            name: recipe.name,
                            comment: recipe.comment,
                            path: snapshot.ref.fullPath,
                            recipeUrl: fileUrl,
                            vegan
                        })
                            .then(() => {
                                navigate('/my-recipes/')
                            })
                            .catch(err => {
                                console.log('something went wrong', err);
                            })
                    }
                })
                .catch(err => {
                    console.log('something went wrong', err);
                })
            })
            .catch(err => {
                console.log('something went wrong', err);
            })

    }, [submit]);

    return { error, loading };
}

export default useCreateFileRecipe;