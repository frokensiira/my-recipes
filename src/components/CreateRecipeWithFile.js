import React, { useState } from "react";
import useCreateFileRecipe from "../hooks/useCreateFileRecipe";
import { ReactComponent as Artichoke } from "../assets/artichoke.svg";
import { storage } from "../firebase";
import Loading from "./Loading";
import StepCounter from "./StepCounter";
import RecipeFormDescription from "./RecipeFormDescription";
import ImageUpload from "./ImageUpload";
import VeganCheckbox from "./VeganCheckbox";
import Dropzone from "./Dropzone";
import RecipeSubmitButton from "./RecipeSubmitButton";
import PageTitle from "./PageTitle";

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
    const { error, setError, loading, setLoading } = useCreateFileRecipe(recipe, submit);
    const [errorMessage, setErrorMessage] = useState(null);

    const resetError = () => {
        setError(false);
        setErrorMessage(null);
    }

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
                resetError();
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
            .catch((error) => {
                setError(true);
                setErrorMessage('Problem med att ladda upp foto. Prova igen.')
                console.error(error);
            });
    };

    const deletePhotoFromStorage = (selectedPhoto) => {
        storage
            .ref()
            .child(photo.fullPath)
            .delete()
            .then(() => {
                resetError();
                // File deleted successfully
                setPhoto(null);
                //and add the new one instead
                addPhotoToStorage(selectedPhoto);
            })
            .catch((error) => {
                console.error(error);
                setError(true);
                setErrorMessage('Problem med uppladdning av foto. Försök igen.');
                console.error(error);
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
                    resetError();
                });
            })
            .catch((error) => {
                console.error(error);
                setError(true);
                setErrorMessage('Problem med att ladda upp filen. Försök igen.')
                setLoading(false);
            });
    };

    const deleteFileFromStorage = (selectedFile) => {
        storage
            .ref()
            .child(file.fullPath)
            .delete()
            .then(() => {
                resetError();
                // File deleted successfully
                setFile(null);
                //add the new one instead
                addFileToStorage(selectedFile);
            })
            .catch((error) => {
                console.error(error);
                setError(true);
                setErrorMessage('Problem med att ladda upp filen. Försök igen.');
                setLoading(false);
            });
    };

    return (
        <div>
            <PageTitle>
                Skapa recept <Artichoke className="icon" />
            </PageTitle>
            <StepCounter />
            <form onSubmit={handleSubmit} className="recipe-form">
                {loading && <Loading />}
                <div className="recipe-form__content--file">
                    <Dropzone
                        recipe={recipe}
                        file={file}
                        setLoading={setLoading}
                        deleteFileFromStorage={deleteFileFromStorage}
                        addFileToStorage={addFileToStorage}
                        setError={setError}
                    />

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

                    <RecipeFormDescription
                        handleInput={handleInput}
                        recipe={recipe}
                    />

                    <VeganCheckbox
                        handleCheckbox={handleCheckbox}
                        recipe={recipe}
                    />

                    <RecipeSubmitButton>Skapa recept</RecipeSubmitButton>
                </div>
                {error && (
                    <div className="error">
                        <p>{errorMessage ? errorMessage : 'Något gick fel, försök igen.'}</p>
                    </div>
                )}
            </form>
        </div>
    );
};

export default CreateRecipeWithFile;
