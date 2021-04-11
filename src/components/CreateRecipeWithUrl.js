import React, { useState, useCallback } from "react";
import useCreateUrlRecipe from "../hooks/useCreateUrlRecipe";
import placeholder from "../assets/images/placeholder.png";
import axios from "axios";
import { storage } from "../firebase";
import ClipLoader from "react-spinners/ClipLoader";
import { useDropzone } from "react-dropzone";
import { ReactComponent as Artichoke } from "../assets/artichoke.svg";
import { ReactComponent as AddImage } from "../assets/plus.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCloudUploadAlt,
    faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const CreateRecipeWithUrl = () => {
    const [submit, setSubmit] = useState(null);
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
        setRecipe({
            ...recipe,
            [e.target.id]: e.target.value,
        });

        if (e.target.id === "url") {
            if (e.target.value.includes("http")) {
                setLoading(true);
                const url = e.target.value;
                const urlEncoded = encodeURIComponent(url);
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
                            : "",
                        url: e.target.value,
                    });
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

    // Dropzone
    const onDrop = useCallback((acceptedFile) => {
        if (acceptedFile.length === 0) {
            return;
        }

        //get root reference
        const storageRef = storage.ref();

        //create a reference based on the photos name
        const fileRef = storageRef.child(
            `photos/${acceptedFile[0].name}${uuidv4()}`
        );

        // //upload photo to fileRef
        fileRef
            .put(acceptedFile[0])
            .then((snapshot) => {
                //retrieve url to uploaded photo
                snapshot.ref.getDownloadURL().then((url) => {
                    setRecipe((prevState) => ({
                        ...prevState,
                        photoUrl: url,
                        fullPath: snapshot.ref.fullPath,
                    }));
                });
            })
            .catch((err) => {
                console.log("something went wrong", err);
            });
    }, []);

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        accept: "image/jpeg, image/png",
        onDrop,
    });

    return (
        <>
            <h1 className="page__title">
                Skapa recept
                <Artichoke className="icon" />
            </h1>
            <div className="page__text-wrapper">
                <Link to={`/my-recipes/create-recipe`}>
                    <FontAwesomeIcon
                        className="page__text-icon"
                        icon={faChevronLeft}
                    />
                </Link>
                <p className="page__text"> Steg 2 av 2</p>
            </div>
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
                            className="recipe-form__input recipe-form__input-url"
                            id="url"
                            required
                            onChange={handleInput}
                        />
                    </div>

                    <div {...getRootProps()} className="recipe-form__dropzone">
                        <input {...getInputProps()} />
                        <div className="recipe-form__image">
                            <img
                                src={
                                    recipe.photoUrl
                                        ? `${recipe.photoUrl}`
                                        : `${placeholder}`
                                }
                                alt="placeholder"
                            />
                            {!recipe.photoUrl && (
                                <div className="recipe-form__overlay"></div>
                            )}

                            <p className="recipe-form__image-text">
                                Lägg till bild
                            </p>
                            <AddImage className="recipe-form__icon-plus" />
                        </div>
                    </div>

                    <div className="recipe-form__field">
                        <label htmlFor="name" className="recipe-form__label">
                            Receptnamn *
                        </label>
                        <input
                            type="text"
                            className="recipe-form__input"
                            id="name"
                            required
                            value={recipe.name}
                            onChange={handleInput}
                        />
                    </div>

                    <div className="recipe-form__field">
                        <label htmlFor="comment" className="recipe-form__label">
                            Kommentar
                        </label>
                        <textarea
                            name="comment"
                            className="recipe-form__textarea"
                            id="comment"
                            rows="4"
                            maxLength="300"
                            onChange={handleInput}
                            value={recipe.comment}
                        ></textarea>
                    </div>

                    <div className="recipe-form__checkbox-wrapper">
                        <label className="recipe-form__switch">
                            <label className="recipe-form__label recipe-form__checkbox-label">
                                <input
                                    type="checkbox"
                                    name="Veganskt"
                                    onChange={handleCheckbox}
                                    className="recipe-form__checkbox"
                                />
                                <span className="recipe-form__slider"></span>
                                Veganskt
                            </label>
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="button recipe-form__submit-button"
                    >
                        Skapa recept
                    </button>
                </div>
            </form>
        </>
    );
};

export default CreateRecipeWithUrl;
