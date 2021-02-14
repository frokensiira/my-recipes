import { useState } from 'react';
import { db, storage } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CreateRecipeWithFile = () => {

    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [recipe, setRecipe] = useState({
        name: '',
        url: '',
        comment: '',
    });
    const [photo, setPhoto] = useState(null);
    const [file, setFile] = useState(null);

    const handleSubmit = (e) => {
        console.log();
        e.preventDefault();

        if(!file){
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
                                    recipeUrl: fileUrl
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
                            recipeUrl: fileUrl
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
        
    }

    const handleInput = (e) => {
        setRecipe({
			...recipe,
			[e.target.id]: e.target.value
		});
    }

    const handleFileChange = (e) => {

        const allowedFileTypes = ['image/jpeg', 'image/png'];
        const selectedFile = e.target.files[0];

        //if there is a photo and the type is ok, add it to state
        if(selectedFile) {
            if(allowedFileTypes.includes(selectedFile.type)) {
                setFile(e.target.files[0])
            }
        }
    }

    const handlePhotoChange = (e) => {
        const allowedPhotoTypes = ['image/jpeg', 'image/png'];
        const selectedPhoto = e.target.files[0];

        //if there is a photo and the type is ok, add it to state
        if(selectedPhoto) {
            if(allowedPhotoTypes.includes(selectedPhoto.type)) {
                setPhoto(e.target.files[0])
            }
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="name">Receptnamn *</label>
                    <input 
                        type="text"     
                        id="name" 
                        required
                        onChange={handleInput}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="recipePhoto">Ladda upp recept</label>
                    <input 
                        type="file"  
                        id="recipePhoto" 
                        onChange={handleFileChange}
                        required
                    />
                </div>

                <div className="">
                    <label htmlFor="comment" className="">Kommentar</label>
                    <textarea 
                        name="comment" 
                        className="" 
                        id="comment" 
                        onChange={handleInput}
                    >
                    </textarea>
                </div>

                <div className="">
                    <label htmlFor="photo" className="">Bild</label>
                    <input 
                        type="file" 
                        className="" 
                        id="photo" 
                        onChange={handlePhotoChange}
                    />
                </div>

                <button type="submit" className="">Skapa recept</button>

            </form>
            
        </div>
    )
}

export default CreateRecipeWithFile;
