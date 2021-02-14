import { useState } from 'react';
import useCreateUrlRecipe from '../hooks/useCreateUrlRecipe';

const CreateRecipeWithUrl = () => {

    const [submit, setSubmit] = useState(null);
    const [vegan, setVegan] = useState(false);
    const [recipe, setRecipe] = useState(null);
    const [photo, setPhoto] = useState(null);
    useCreateUrlRecipe(recipe, photo, vegan, submit);

    const handleCheckbox = (e) => {
        setVegan(false);
        if(e.target.checked === true) {
            setVegan(true);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!recipe) {
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
        <>
            <h1 className="page__title">Skapa recept</h1>
            <p className="page__text">Steg 2 av 2</p>
            <form onSubmit={handleSubmit}>

                <div className="">
                    <label htmlFor="name" className="form-label">Receptnamn *</label>
                    <input 
                        type="text"     
                        className="" 
                        id="name" 
                        required
                        onChange={handleInput}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="url" className="">Länk *</label>
                    <input 
                        type="url" 
                        className="" 
                        id="url" 
                        required
                        onChange={handleInput}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="comment" className="">Kommentar</label>
                    <textarea 
                        name="comment" 
                        className="" 
                        id="comment" 
                        onChange={handleInput}
                    >
                    </textarea>
                </div>

                <div className="mb-3">
                    <label htmlFor="photo" className="">Bild</label>
                    <input 
                        type="file" 
                        className="form-control" 
                        id="photo" 
                        onChange={handleFileChange}
                    />
                </div>

                <div>
                    <input type="checkbox" name="Veganskt" onChange={handleCheckbox}/>
                    <label>Veganskt</label>
                </div>

                <button type="submit" className="">Skapa recept</button>

            </form>
            
        </>
    )
}

export default CreateRecipeWithUrl
