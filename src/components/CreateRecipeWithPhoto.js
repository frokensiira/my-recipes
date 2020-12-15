import { useState } from 'react';
import {storage} from '../firebase';

const CreateRecipeWithPhoto = () => {

    const [recipe, setRecipe] = useState({});
    const [photo, setPhoto] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        //get root reference
        const storageRef = storage.ref();

        //create a reference based on the photos name
        const fileRef = storageRef.child(photo.name);
        
        //upload photo to fileRef
        fileRef.put(photo)
            .then(snapshot => {
                console.log('this is snapshot', snapshot);

                //retrieve url to uploaded photo
                snapshot.ref.getDownloadURL().then(url => {
                    
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
        console.log('this is photo', e.target.files[0]);
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
        <div className="container mt-3">
            <form onSubmit={handleSubmit}>

                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Receptnamn</label>
                    <input 
                        type="text"     
                        className="form-control" 
                        id="name" 
                        required
                        onChange={handleInput}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="url" className="form-label">Länk</label>
                    <input 
                        type="url" 
                        className="form-control" 
                        id="url" 
                        required
                        onChange={handleInput}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="comment" className="form-label">Ev. kommentar</label>
                    <textarea 
                        name="comment" 
                        className="form-control" 
                        id="comment" 
                        onChange={handleInput}
                    >
                    </textarea>
                </div>

                <div className="mb-3">
                    <label htmlFor="photo" className="form-label">Ev. bild</label>
                    <input 
                        type="file" 
                        className="form-control" 
                        id="photo" 
                        onChange={handleFileChange}
                    />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>

            </form>
            
        </div>
    )
}

export default CreateRecipeWithPhoto;
