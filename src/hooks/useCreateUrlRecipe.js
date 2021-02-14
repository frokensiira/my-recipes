import { db, storage } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const useUploadAlbum = (recipe, photo, submit) => {

    const [error, setError ] = useState(null);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {

        if(!recipe) {
            return;
        }

        if(photo) {
            //get root reference
            const storageRef = storage.ref();

            //create a reference based on the photos name
            const fileRef = storageRef.child(`photos/${photo.name}`);
            
            //upload photo to fileRef
            fileRef.put(photo)
                .then(snapshot => {
                    console.log('this is snapshot', snapshot);

                    //retrieve url to uploaded photo
                    snapshot.ref.getDownloadURL().then(url => {

                        //add uploaded photo to database
                        db.collection('recipes').add({
                            owner: currentUser.uid,
                            name: recipe.name,
                            url: recipe.url,
                            comment: recipe.comment,
                            path: snapshot.ref.fullPath,
                            photoUrl: url
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
                console.log('something went wrong', err);
            })

        } else {
            //add uploaded recipe to database
            db.collection('recipes').add({
                owner: currentUser.uid,
                name: recipe.name,
                url: recipe.url,
                comment: recipe.comment,
            })
                .then(() => {
                    navigate('/my-recipes/')
                })
                .catch(err => {
                    console.log('something went wrong', err);
                })
        }

    }, [submit]);

    return { error, loading };
}

export default useUploadAlbum;