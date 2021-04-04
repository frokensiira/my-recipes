import React, { useState, useCallback, useEffect } from "react";
import placeholder from "../assets/images/placeholder.png";
import axios from "axios";
import { storage } from "../firebase";
import ClipLoader from "react-spinners/ClipLoader";
import { useDropzone } from "react-dropzone";
import { ReactComponent as Radish } from "../assets/radish.svg";
import { ReactComponent as AddImage } from "../assets/plus.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";
import useRecipe from "../hooks/useRecipe";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
    faCloudUploadAlt,
} from "@fortawesome/free-solid-svg-icons";

const EditRecipeWithUrl = () => {

    const { recipeId } = useParams();
    const { recipe } = useRecipe(recipeId);
    const [newRecipe, setNewRecipe] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); 

    useEffect(() => { 
        if(recipe.length !== 0) {
            setNewRecipe(recipe);
        }
    }, [recipe])

    const handleCheckbox = (e) => {
        setNewRecipe(prevstate => ({
            ...prevstate,
            vegan: e.target.checked,
        }));
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();

        try {
            const res = await db.collection('recipes').doc(recipeId).set(newRecipe);
            navigate("/my-recipes/");
        } catch(error) {
            console.log('error', error);
        }
    };

    const handleInput = async (e) => {       
        
        setNewRecipe(prevstate => ({
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
                    v = c == "x" ? r : (r & 0x3) | 0x8;
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
        const fileRef = storageRef.child(`photos/${acceptedFile[0].name}${uuidv4()}`);

        // //upload photo to fileRef
        fileRef
            .put(acceptedFile[0])
            .then((snapshot) => {
                //retrieve url to uploaded photo
                snapshot.ref.getDownloadURL().then((url) => {
                    setNewRecipe(prevState => ({
                        ...prevState,
                        photoUrl: url,
                        fullPath: snapshot.ref.fullPath
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
            <h1 className="page__title">Redigera recept<Radish className="icon"/></h1>
            <form className="recipe-form" onSubmit={handleSaveChanges}>
                {loading && (
                    <div className="recipe-form--loading">
                        <ClipLoader color="var(--green)" />
                    </div>
                )}

                {
                    newRecipe &&
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
                            value={newRecipe.url}
                            onChange={handleInput}
                        />
                    </div>
                    <div className="recipe-form__image">
                        <img
                            src={
                                newRecipe.photoUrl
                                    ? `${newRecipe.photoUrl}`
                                    : `${placeholder}`
                            }
                            alt="placeholder"
                        />
                        {!newRecipe.photoUrl && (
                            <div className="recipe-form__overlay"></div>
                        )}

                        <p className="recipe-form__image-text">
                            Bild på recept
                        </p>
                        <AddImage className="recipe-form__icon-plus"/>
                    </div>

                    <div {...getRootProps()} className="recipe-form__dropzone">
                        <input {...getInputProps()} />
                        <div className="recipe-form__dropzone-text">
                            <FontAwesomeIcon
                                className="recipe-form__upload-icon"
                                icon={faCloudUploadAlt}
                            />
                            {isDragActive ? (
                                isDragAccept ? (
                                    <p>Släpp bilden här</p>
                                ) : (
                                    <p>
                                        Ledsen, fel filtyp, testa jpg eller png
                                    </p>
                                )
                            ) : newRecipe.photoUrl === "" ? (
                                <p>Ladda upp bild</p>
                            ) : (
                                <p>Byt bild</p>
                            )}
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
                            value={newRecipe.name}
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
                            value={newRecipe.comment}
                        ></textarea>
                    </div>

                    <div className="recipe-form__checkbox-wrapper">
                        <label className="recipe-form__switch">
                            <input
                                type="checkbox"
                                name="Veganskt"
                                onChange={handleCheckbox}
                                className="recipe-form__checkbox"
                                checked={newRecipe.vegan}
                            />
                            <span className="recipe-form__slider"></span>
                        </label>
                        <label className="recipe-form__label">Veganskt</label>
                    </div>
                    <button
                        type="submit"
                        className="button recipe-form__submit-button"
                    >
                        Spara recept
                    </button>
                </div>
                }

                
            </form>
        </>
    );
};

export default EditRecipeWithUrl;