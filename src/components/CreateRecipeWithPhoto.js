import { useState } from 'react';
import { db, storage } from '../firebase';
import { useNavigate } from 'react-router-dom';

const CreateRecipeWithPhoto = () => {

    const navigate = useNavigate();
    const [recipe, setRecipe] = useState({
        name: '',
        url: '',
        comment: '',
    });
    const [photo, setPhoto] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

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
                        console.log('this is url', url);
                        //add uploaded photo to database
                        db.collection('recipes').add({
                            name: recipe.name,
                            comment: recipe.comment,
                            path: snapshot.ref.fullPath,
                            photoUrl: url, 
                            recipeUrl: 'hej'
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

        
    }

    const handleInput = (e) => {
        setRecipe({
			...recipe,
			[e.target.id]: e.target.value
		});
    }

    const handleFileChange = (e) => {

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
                    <label htmlFor="name">Receptnamn</label>
                    <input 
                        type="text"     
                        id="name" 
                        required
                        onChange={handleInput}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="recipePhoto">Bild på recept</label>
                    <input 
                        type="file"  
                        id="recipePhoto" 
                        onChange={handleFileChange}
                        required
                    />
                </div>

                <div className="">
                    <label htmlFor="comment" className="">Ev. kommentar</label>
                    <textarea 
                        name="comment" 
                        className="" 
                        id="comment" 
                        onChange={handleInput}
                    >
                    </textarea>
                </div>

                <div className="">
                    <label htmlFor="photo" className="">Ev. bild på rätt</label>
                    <input 
                        type="file" 
                        className="" 
                        id="photo" 
                        onChange={handleFileChange}
                    />
                </div>

                <button type="submit" className="">Submit</button>

            </form>
            
        </div>
    )
}

export default CreateRecipeWithPhoto;
