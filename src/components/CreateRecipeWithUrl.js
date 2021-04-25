import React, { useState } from "react";
import useCreateUrlRecipe from "../hooks/useCreateUrlRecipe";
import axios from "axios";
import { storage } from "../firebase";
import ClipLoader from "react-spinners/ClipLoader";
import { ReactComponent as Artichoke } from "../assets/artichoke.svg";
import StepCounter from "./StepCounter";
import ImageUpload from "./ImageUpload";
import RecipeFormDescription from "./RecipeFormDescription";
import VeganCheckbox from "./VeganCheckbox";
import RecipeSubmitButton from "./RecipeSubmitButton";

const CreateRecipeWithUrl = () => {
    const [submit, setSubmit] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [recipe, setRecipe] = useState({
        name: "",
        comment: "",
        photoUrl: "",
        url: "",
        vegan: false,
    });
    const [loading, setLoading] = useState(false);

    useCreateUrlRecipe(recipe, submit);

    const handleCheckbox = (e) => {
        setRecipe({
            ...recipe,
            vegan: e.target.checked,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmit(true);
    };

    const handleInput = async (e) => {
        setRecipe((prevstate) => ({
            ...prevstate,
            [e.target.id]: e.target.value,
        }));

        if (e.target.id === "url") {
            if (e.target.value.includes("http")) {
                setLoading(true);
                const url = e.target.value;
                const urlEncoded = encodeURIComponent(url);
                try {
                    const requestUrl = await `https://ogp-api.herokuapp.com/?url=${urlEncoded}`;
                    const response = await axios.get(requestUrl);

                    if (!response.data.error) {
                        setRecipe({
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
                            fullPathPhoto: null,
                        });
                        //if user uploaded an image before, remove it from storage
                        if (photo) {
                            deletePhotoFromStorage();
                        }
                        setLoading(false);
                    }
                } catch (err) {
                    setLoading(false);
                    console.log("error", err);
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
                //retrieve url to uploaded photo
                snapshot.ref.getDownloadURL().then((url) => {
                    setRecipe((prevState) => ({
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
                console.log("problem uploading photo", err);
            });
    };

    const deletePhotoFromStorage = (selectedPhoto) => {
        storage
            .ref()
            .child(photo.fullPathPhoto)
            .delete()
            .then(() => {
                // File deleted successfully
                setPhoto(null);
                //and add the new one instead if the user uploaded a new one manually
                if (selectedPhoto) {
                    addPhotoToStorage(selectedPhoto);
                }
            })
            .catch((error) => {
                console.log("could not delete photo", error);
                setLoading(false);
            });
    };

    const handlePhotoChange = (e) => {
        const allowedPhotoTypes = ["image/jpeg", "image/png"];
        const selectedPhoto = e.target.files[0];

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
                Skapa recept
                <Artichoke className="icon" />
            </h1>
            <StepCounter />
            <form className="recipe-form" onSubmit={handleSubmit}>
                {loading && (
                    <div className="recipe-form--loading">
                        <ClipLoader color="var(--green)" />
                    </div>
                )}

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
                            onChange={handleInput}
                        />
                    </div>

                    <ImageUpload
                        handlePhotoChange={handlePhotoChange}
                        recipe={recipe}
                    />

                    <div className="recipe-form__field">
                        <label htmlFor="name" className="recipe-form__label">
                            Receptnamn *
                        </label>
                        <input
                            type="text"
                            className="form__input"
                            id="name"
                            required
                            value={recipe.name}
                            onChange={handleInput}
                        />
                    </div>

                    <RecipeFormDescription handleInput={handleInput} recipe={recipe} />

                    <VeganCheckbox handleCheckbox={handleCheckbox} recipe={recipe} />
                
                    <RecipeSubmitButton>Skapa recept</RecipeSubmitButton>
                </div>
            </form>
        </>
    );
};

export default CreateRecipeWithUrl;
