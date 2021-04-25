import React, { useState, useCallback } from "react";
import useCreateFileRecipe from "../hooks/useCreateFileRecipe";
import { ReactComponent as Artichoke } from "../assets/artichoke.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import { storage } from "../firebase";
import { useDropzone } from "react-dropzone";
import ClipLoader from "react-spinners/ClipLoader";
import StepCounter from "./StepCounter";
import RecipeFormDescription from "./RecipeFormDescription";
import ImageUpload from "./ImageUpload";
import VeganCheckbox from "./VeganCheckbox";

const CreateRecipeWithFile = () => {
    const [photo, setPhoto] = useState(null);
    const [file, setFile] = useState(null);
    const [recipe, setRecipe] = useState({
        name: "",
        comment: "",
        photoUrl: "",
        fullPathPhoto: "",
        fileUrl: "",
        fullPathFile: "",
        vegan: false,
    });
    const [submit, setSubmit] = useState(null);
    const [loading, setLoading] = useState(false);
    useCreateFileRecipe(recipe, submit);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!recipe.fileUrl) {
            return;
        }
        setSubmit(true);
    };

    const handleInput = (e) => {
        setRecipe((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };

    const handleCheckbox = (e) => {
        setRecipe({
            ...recipe,
            vegan: e.target.checked,
        });
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
        storage
            .ref()
            .child(photo.fullPath)
            .delete()
            .then(() => {
                // File deleted successfully
                setPhoto(null);
                //and add the new one instead
                addPhotoToStorage(selectedPhoto);
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
                    setRecipe((prevState) => ({
                        ...prevState,
                        fileName: selectedFile.name,
                        fileUrl: url,
                        fullPathFile: snapshot.ref.fullPath,
                    }));
                    //save the file in a state to see if the user changes file in the future
                    setFile({ fullPath: snapshot.ref.fullPath });
                    setLoading(false);
                });
            })
            .catch((err) => {
                console.log("something went wrong", err);
                setLoading(false);
            });
    };

    const deleteFileFromStorage = (selectedFile) => {
        storage
            .ref()
            .child(file.fullPath)
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
                Skapa recept <Artichoke className="icon" />
            </h1>
            <StepCounter />
            <form onSubmit={handleSubmit} className="recipe-form">
                {loading && (
                    <div className="recipe-form--loading">
                        <ClipLoader color="var(--green)" />
                    </div>
                )}
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
                                        Ledsen, fel filtyp, testa jpg eller png{" "}
                                    </p>
                                )
                            ) : recipe.fileUrl === "" ? (
                                <p>Ladda upp recept</p>
                            ) : (
                                <p>Byt receptfil</p>
                            )}
                            {recipe.fileName && <p>{recipe.fileName}</p>}
                        </div>
                    </div>

                    <ImageUpload handlePhotoChange={handlePhotoChange} recipe={recipe}/>

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
