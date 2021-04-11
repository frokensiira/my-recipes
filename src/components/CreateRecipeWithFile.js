import React, { useState, useCallback } from "react";
import useCreateFileRecipe from "../hooks/useCreateFileRecipe";
import { ReactComponent as Artichoke } from "../assets/artichoke.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCloudUploadAlt,
    faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { ReactComponent as AddImage } from "../assets/plus.svg";
import placeholder from "../assets/images/placeholder.png";
import { storage } from "../firebase";
import { useDropzone } from "react-dropzone";

const CreateRecipeWithFile = () => {
    const [recipe, setRecipe] = useState({
        name: "",
        comment: "",
        photoUrl: "",
        url: "",
        vegan: false,
    });
    const [photo, setPhoto] = useState(null);
    const [file, setFile] = useState(null);
    const [vegan, setVegan] = useState(false);
    const [submit, setSubmit] = useState(null);
    //useCreateFileRecipe(recipe, photo, file, vegan, submit);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!file) {
            return;
        }

        setSubmit(true);
    };

    const handleInput = (e) => {
        setRecipe({
            ...recipe,
            [e.target.id]: e.target.value,
        });
    };

    const handleCheckbox = (e) => {
        setVegan(false);
        if (e.target.checked === true) {
            setVegan(true);
        }
    };

    const handleFileChange = (e) => {
        const allowedFileTypes = ["image/jpeg", "image/png"];
        const selectedFile = e.target.files[0];

        //if there is a photo and the type is ok, add it to state
        if (selectedFile) {
            if (allowedFileTypes.includes(selectedFile.type)) {
                setFile(e.target.files[0]);
            }
        }
    };

    const handlePhotoChange = (e) => {
        const allowedPhotoTypes = ["image/jpeg", "image/png"];
        const selectedPhoto = e.target.files[0];

        //if there is a photo and the type is ok, add it to state
        if (selectedPhoto) {
            if (allowedPhotoTypes.includes(selectedPhoto.type)) {
                setPhoto(e.target.files[0]);
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
        <div>
            <h1 className="page__title">
                Skapa recept <Artichoke className="icon" />
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
            <form onSubmit={handleSubmit} className="recipe-form">
                <div className="recipe-form__content--file">
                    <div
                        {...getRootProps()}
                        className="recipe-form__dropzone--file"
                    >
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
                                        Ledsen, fel filtyp, testa jpg eller png{" "}
                                    </p>
                                )
                            ) : recipe.photoUrl === "" ? (
                                <p>Ladda upp recept</p>
                            ) : (
                                <p>Byt bild</p>
                            )}
                        </div>
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

                    {/* <div className="">
                        <label htmlFor="photo" className="">
                            Bild
                        </label>
                        <input
                            type="file"
                            className=""
                            id="photo"
                            onChange={handlePhotoChange}
                        />
                    </div> */}

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
        </div>
    );
};

export default CreateRecipeWithFile;
