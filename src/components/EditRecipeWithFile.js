import React, { useState, useCallback, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import { ReactComponent as AddImage } from "../assets/plus.svg";
import placeholder from "../assets/images/placeholder.png";
import { storage } from "../firebase";
import { useDropzone } from "react-dropzone";
import { useParams } from "react-router-dom";
import useRecipe from "../hooks/useRecipe";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { ReactComponent as Radish } from "../assets/radish.svg";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

const EditRecipeWithFile = () => {
    const [photo, setPhoto] = useState(null);
    const [file, setFile] = useState(null);
    const { recipeId } = useParams();
    const { recipe } = useRecipe(recipeId);
    const [newRecipe, setNewRecipe] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (recipe.length !== 0) {
            setNewRecipe(recipe);
            setPhoto(recipe.fullPathPhoto);
            setFile(recipe.fullPathFile);
        }

        return () => {
            setNewRecipe(null);
        };
    }, [recipe]);

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
                navigate("/my-recipes/");
            })
            .catch((err) => {
                console.log("error", err);
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
                //retrieve url to uploaded photo
                snapshot.ref.getDownloadURL().then((url) => {
                    setNewRecipe((prevState) => ({
                        ...prevState,
                        photoUrl: url,
                        fullPathPhoto: snapshot.ref.fullPath,
                    }));

                    setPhoto({
                        fullPath: snapshot.ref.fullPath,
                    });
                    setLoading(false);
                });
            })
            .catch((err) => {
                console.log("problem uploading photo", err);
            });
    };

    const deletePhotoFromStorage = (selectedPhoto) => {
        //let photoUpload = photo.fullPath ? photo.fullPath : photo;
        storage
            .ref()
            .child(photo)
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

    const addFileToStorage = (selectedFile) => {
        //create a reference based on the files name
        const fileRef = storage
            .ref()
            .child(`files/${selectedFile.name}${uuidv4()}`);

        //upload file to fileRef
        fileRef
            .put(selectedFile)
            .then((snapshot) => {
                //retrieve url to uploaded file
                snapshot.ref.getDownloadURL().then((url) => {
                    setNewRecipe((prevState) => ({
                        ...prevState,
                        fileName: selectedFile.name,
                        fileUrl: url,
                        fullPathFile: snapshot.ref.fullPath,
                    }));
                    //save the file in a state to see if the user changes file in the future
                    setFile({ fullPath: snapshot.ref.fullPath });
                });
                setLoading(false);
            })
            .catch((err) => {
                console.log("something went wrong", err);
                setLoading(false);
            });
    };

    const deleteFileFromStorage = (selectedFile) => {
        let fileUpload = file.fullPath ? file.fullPath : file;
        storage
            .ref()
            .child(fileUpload)
            .delete()
            .then(() => {
                // File deleted successfully
                setFile(null);
                //add the new one instead
                addFileToStorage(selectedFile);
            })
            .catch((error) => {
                console.log("could not delete photo", error);
                setLoading(false);
            });
    };

    // Dropzone
    const onDrop = useCallback(
        (acceptedFile) => {
            if (acceptedFile.length === 0) {
                return;
            }
            setLoading(true);
            //check if a user already uploaded a file
            if (file) {
                //in that case delete it before uploading a new one
                deleteFileFromStorage(acceptedFile[0]);
            } else {
                //otherwise add it to storage
                addFileToStorage(acceptedFile[0]);
            }
        },
        [file]
    );

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
                Redigera recept <Radish className="icon" />
            </h1>

            <form className="recipe-form" onSubmit={handleSaveChanges}>
                {loading && (
                    <div className="recipe-form--loading">
                        <ClipLoader color="var(--green)" />
                    </div>
                )}
                {newRecipe && (
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
                                        <p>Släpp filen här</p>
                                    ) : (
                                        <p>
                                            Ledsen, fel filtyp, testa jpg eller
                                            png{" "}
                                        </p>
                                    )
                                ) : recipe.fileUrl === "" ? (
                                    <p>Ladda upp recept</p>
                                ) : (
                                    <p>Byt receptfil</p>
                                )}
                                {newRecipe.fileName && (
                                    <p>{newRecipe.fileName}</p>
                                )}
                            </div>
                        </div>

                        <label
                            className="recipe-form__image-upload"
                            htmlFor="photo"
                        >
                            <input
                                type="file"
                                id="photo"
                                onChange={handlePhotoChange}
                            />
                            <div className="recipe-form__image">
                                {newRecipe.photoUrl ? (
                                    <>
                                        <img
                                            src={newRecipe.photoUrl}
                                            alt="presentation"
                                        />
                                        <p className="recipe-form__image-text">
                                            Byt bild
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <img
                                            src={placeholder}
                                            alt="placeholder"
                                        />
                                        <div className="recipe-form__overlay"></div>
                                        <p className="recipe-form__image-text">
                                            Lägg till bild
                                        </p>
                                    </>
                                )}
                                <AddImage className="recipe-form__icon-plus" />
                            </div>
                        </label>

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

                        <div className="recipe-form__field">
                            <label
                                htmlFor="comment"
                                className="recipe-form__label"
                            >
                                Kommentar
                            </label>
                            <textarea
                                name="comment"
                                className="form__textarea"
                                id="comment"
                                rows="4"
                                maxLength="300"
                                onChange={handleInput}
                                value={newRecipe.comment}
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
                                        checked={newRecipe.vegan}
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
                            Spara recept
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default EditRecipeWithFile;
