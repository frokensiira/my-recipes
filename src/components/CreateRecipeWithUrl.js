import React, { useState } from "react";
import useCreateUrlRecipe from "../hooks/useCreateUrlRecipe";
import placeholder from "../assets/images/placeholder.png";
import axios from "axios";
import { storage } from "../firebase";

const CreateRecipeWithUrl = () => {
    const [submit, setSubmit] = useState(null);
    const [vegan, setVegan] = useState(false);
    const [recipe, setRecipe] = useState({
        name: "",
        comment: "",
        photoUrl: "",
        url: "",
    });
    const [photoUrl, setPhotoUrl] = useState(null);
    const [fullPath, setFullPath] = useState(null);
    const [loading, setLoading] = useState(false);

    useCreateUrlRecipe(recipe, photoUrl, fullPath, vegan, submit);

    const handleCheckbox = (e) => {
        setVegan(false);
        if (e.target.checked === true) {
            setVegan(true);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setSubmit(true);
    };

    const handleInput = async (e) => {
        setRecipe({
            ...recipe,
            [e.target.id]: e.target.value,
        });

        if (e.target.id === "url") {
            setLoading(true);
            const url = e.target.value;
            const urlEncoded = encodeURIComponent(url);
            const requestUrl = await `https://ogp-api.herokuapp.com/?url=${urlEncoded}`;
            const response = await axios.get(requestUrl);

            console.log(response);

            if (!response.data.error) {
                setRecipe({
                    ...recipe,
                    name: response.data.ogTitle,
                    comment: response.data.ogDescription
                        ? response.data.ogDescription
                        : response.data.twitterDescription,
                    photoUrl: response.data.ogImage.url,
                    url: e.target.value,
                });
                setLoading(false);
            }
        }
    };

    const handleFileChange = (e) => {
        console.log("this is photo", e.target.files[0]);
        const allowedPhotoTypes = ["image/jpeg", "image/png"];
        const selectedPhoto = e.target.files[0];

        //if there is a photo and the type is ok, add it to state
        if (selectedPhoto) {
            if (allowedPhotoTypes.includes(selectedPhoto.type)) {
                //get root reference
                const storageRef = storage.ref();

                //create a reference based on the photos name
                const fileRef = storageRef.child(
                    `photos/${e.target.files[0].name}`
                );

                //upload photo to fileRef
                fileRef
                    .put(e.target.files[0])
                    .then((snapshot) => {
                        //retrieve url to uploaded photo
                        snapshot.ref.getDownloadURL().then((url) => {
                            setFullPath(snapshot.ref.fullPath);
                            setPhotoUrl(url);
                        });
                    })
                    .catch((err) => {
                        console.log("something went wrong", err);
                    });
            }
        }
    };

    console.log("photoUrl is", photoUrl);
    console.log("photoUrl recipe is", recipe.photoUrl);

    return (
        <>
            <h1 className="page__title">Skapa recept</h1>
            <p className="page__text">Steg 2 av 2</p>
            <form className="recipe-form" onSubmit={handleSubmit}>
                {loading && <p>Laddar...</p>}

                <div className="recipe-form__content">
                    <div className="recipe-form__image">
                        <img
                            className="recipe-form__image"
                            src={
                                photoUrl
                                    ? `${photoUrl}`
                                    : recipe.photoUrl
                                    ? `${recipe.photoUrl}`
                                    : `${placeholder}`
                            }
                            alt="placeholder-image"
                        />
                        {!photoUrl && !recipe.photoUrl && (
                            <div className="recipe-form__overlay"></div>
                        )}

                        <p className="recipe-form__image-text">
                            Bild på recept
                        </p>
                    </div>

                    <div className="recipe-form__inputs">
                        <label htmlFor="url" className="">
                            Länk*
                        </label>
                        <input
                            type="url"
                            className="recipe-form__input"
                            id="url"
                            required
                            onChange={handleInput}
                        />

                        <label htmlFor="name" className="form-label">
                            Receptnamn*
                        </label>
                        <input
                            type="text"
                            className="recipe-form__input"
                            id="name"
                            required
                            value={recipe.name}
                            onChange={handleInput}
                        />

                        <label htmlFor="comment" className="">
                            Kommentar
                        </label>
                        <textarea
                            name="comment"
                            className="recipe-form__textarea"
                            id="comment"
                            rows="5"
                            cols="40"
                            onChange={handleInput}
                            value={recipe.comment}
                        ></textarea>

                        <label htmlFor="photo" className="">
                            Bild
                        </label>
                        <input
                            type="file"
                            className="form-control"
                            id="photo"
                            onChange={handleFileChange}
                        />

                        <div>
                            <input
                                type="checkbox"
                                name="Veganskt"
                                onChange={handleCheckbox}
                            />
                            <label>Veganskt</label>
                        </div>
                    </div>
                </div>

                <button type="submit" className="">
                    Skapa recept
                </button>
            </form>
        </>
    );
};

export default CreateRecipeWithUrl;
