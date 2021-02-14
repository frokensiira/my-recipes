import { useState } from 'react';
import useCreateFileRecipe from '../hooks/useCreateFileRecipe';

const CreateRecipeWithFile = () => {

    const [recipe, setRecipe] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [file, setFile] = useState(null);
    const [vegan, setVegan] = useState(false);
    const [submit, setSubmit] = useState(null);
    useCreateFileRecipe(recipe, photo, file, vegan, submit);

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!file){
            return;
        }

        setSubmit(true);
        
    }

    const handleInput = (e) => {
        setRecipe({
			...recipe,
			[e.target.id]: e.target.value
		});
    }

    const handleCheckbox = (e) => {
        setVegan(false);
        if(e.target.checked === true) {
            setVegan(true);
        }
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
            <h1 className="page__title">Skapa recept</h1>
            <p className="page__text">Steg 2 av 2</p>
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
                    <label htmlFor="recipePhoto">Ladda upp recept *</label>
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

                <div>
                    <input type="checkbox" name="Veganskt" onChange={handleCheckbox}/>
                    <label>Veganskt</label>
                </div>

                <button type="submit" className="">Skapa recept</button>

            </form>
            
        </div>
    )
}

export default CreateRecipeWithFile;
