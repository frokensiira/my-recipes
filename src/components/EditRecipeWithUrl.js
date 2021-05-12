import React, { useState, useEffect } from "react";
import axios from "axios";
import { storage } from "../firebase";
import Loading from "./Loading";
import { useParams } from "react-router-dom";
import useRecipe from "../hooks/useRecipe";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { ReactComponent as Radish } from "../assets/radish.svg";
import ImageUpload from "./ImageUpload";
import RecipeFormDescription from "./RecipeFormDescription";
import VeganCheckbox from "./VeganCheckbox";
import RecipeSubmitButton from "./RecipeSubmitButton";

const EditRecipeWithUrl = () => {
    const { recipeId } = useParams();
    const { recipe } = useRecipe(recipeId);
    const navigate = useNavigate();
    const [photo, setPhoto] = useState(null);
    const [newRecipe, setNewRecipe] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        if (recipe && recipe.length !== 0) {
            setNewRecipe(recipe);
            if(recipe.fullPathPhoto && recipe.fullPathPhoto !== "") {
                setPhoto({fullPathPhoto: recipe.fullPathPhoto});
            }
        }

        return () => {
            setNewRecipe(null);
        };
    }, [recipe]);

    const resetError = () => {
        setError(false);
        setErrorMessage(null);
    }

    const handleCheckbox = (e) => {
        setNewRecipe((prevstate) => ({
            ...prevstate,
            vegan: e.target.checked,
        }));
    };

    const handleSaveChanges = (e) => {
        e.preventDefault();

        db.collection("recipes")
            .doc(recipeId)
            .set(newRecipe)
            .then(() => {
                resetError();
                setLoading(false);
                navigate("/my-recipes/");
            })
            .catch((error) => {
                setError(true);
                setErrorMessage(error.message);
                setLoading(false);
            });
    };

    const handleInput = async (e) => {        
        setNewRecipe((prevstate) => ({
            ...prevstate,
            [e.target.id]: e.target.value,
        }));
        
        if (e.target.id === "url") {
            
            if (e.target.value.includes("http")) {                
                setLoading(true);
                const url = e.target.value;
                const urlEncoded = encodeURIComponent(url);
                const requestUrl = await `https://ogp-api.herokuapp.com/?url=${urlEncoded}`;
                const response = await axios.get(requestUrl);                

                if (!response.data.error) {
                    setNewRecipe({
                        ...recipe,
                        name: response.data.ogTitle
                            ? response.data.ogTitle
                            : "",
                        comment: response.data.ogDescription
                            ? response.data.ogDescription
                            : response.data.twitterDescription
                            ? response.data.twitterDescription
                            : "",
                        photoUrl: response.data.ogImage
                            ? response.data.ogImage.url
                                ? response.data.ogImage.url
                                : ""
                            : "",
                        url: e.target.value,
                    });
                    //if user uploaded an image before, remove it from storage
                    if (photo) {                        
                        deletePhotoFromStorage();
                    }
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        }
    };

    const uuidv4 = () => {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            function (c) {
                var r = (Math.random() * 16) | 0,
                    v = c === "x" ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            }
        );
    };

    const addPhotoToStorage = (selectedPhoto) => {
        const photoRef = storage
            .ref()
            .child(`photos/${selectedPhoto.name}${uuidv4()}`);

        //upload photo to photoRef
        photoRef
            .put(selectedPhoto)
            .then((snapshot) => {
                resetError();
                //retrieve url to uploaded photo
                snapshot.ref.getDownloadURL().then((url) => {                    
                    setNewRecipe((prevState) => ({
                        ...prevState,
                        photoUrl: url,
                        fullPathPhoto: snapshot.ref.fullPath,
                    }));

                    setPhoto({
                        fullPathPhoto: snapshot.ref.fullPath,
                    });
                    setLoading(false);
                });
            })
            .catch((err) => {
                setError(true);
                setErrorMessage('Problem med att ladda upp foto. Prova igen.');
                setLoading(false);
            });
    };

    const deletePhotoFromStorage = (selectedPhoto) => {
        storage
            .ref()
            .child(photo.fullPathPhoto)
            .delete()
            .then(() => {
                resetError();
                // File deleted successfully
                setPhoto(null);
                setNewRecipe((prevstate) => ({
                    ...prevstate,
                    fullPathPhoto: null,
                }));
                
                //and add the new one instead if the user uploaded a new one manually
                if (selectedPhoto) {
                    addPhotoToStorage(selectedPhoto);
                }
            })
            .catch((error) => {
                console.error(error);
                setError(true);
                setErrorMessage('Problem med uppladdning av foto. Försök igen.');
                setLoading(false);
            });
    };

    const handlePhotoChange = (e) => {
        const allowedPhotoTypes = ["image/jpeg", "image/png"];
        const selectedPhoto = e.target.files[0];
        resetError();

        //if there is a photo and the type is ok, proceed
        if (selectedPhoto) {
            if (allowedPhotoTypes.includes(selectedPhoto.type)) {
                setLoading(true);

                //if the user changed photo, delete the old one from storage
                if (photo) {
                    deletePhotoFromStorage(selectedPhoto);
                } else {
                    addPhotoToStorage(selectedPhoto);
                }
            }
        }
    };

    return (
        <>
            <h1 className="page__title">
                Redigera recept
                <Radish className="icon" />
            </h1>
            <form className="recipe-form" onSubmit={handleSaveChanges}>
                {loading && (
                    <Loading/>
                )}

                {newRecipe && (
                    <div className="recipe-form__content">
                        <div className="recipe-form__field">
                            <label htmlFor="url" className="recipe-form__label">
                                Länk *
                            </label>
                            <input
                                type="url"
                                className="form__input recipe-form__input-url"
                                id="url"
                                required
                                value={newRecipe.url}
                                onChange={handleInput}
                            />
                        </div>

                        <ImageUpload handlePhotoChange={handlePhotoChange} recipe={newRecipe}/>

                        <div className="recipe-form__field">
                            <label
                                htmlFor="name"
                                className="recipe-form__label"
                            >
                                Receptnamn *
                            </label>
                            <input
                                type="text"
                                className="form__input"
                                id="name"
                                required
                                value={newRecipe.name}
                                onChange={handleInput}
                            />
                        </div>

                        <RecipeFormDescription handleInput={handleInput} recipe={newRecipe} />

                        <VeganCheckbox handleCheckbox={handleCheckbox} recipe={newRecipe} />
                        
                        <RecipeSubmitButton>Spara recept</RecipeSubmitButton>
                    </div>
                )}
                {error && (
                    <div className="error">
                        <p>{errorMessage ? errorMessage : 'Något gick fel, försök igen.'}</p>
                    </div>
                )}
            </form>
        </>
    );
};

export default EditRecipeWithUrl;
