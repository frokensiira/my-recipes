import React, { useState, useEffect } from "react";
import { storage } from "../firebase";
import { useParams } from "react-router-dom";
import useRecipe from "../hooks/useRecipe";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { ReactComponent as Radish } from "../assets/radish.svg";
import Loading from "./Loading";
import ImageUpload from "./ImageUpload";
import RecipeFormDescription from "./RecipeFormDescription";
import VeganCheckbox from "./VeganCheckbox";
import Dropzone from "./Dropzone";
import RecipeSubmitButton from "./RecipeSubmitButton";

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
            if (recipe.fullPathPhoto !== "") {
                setPhoto({ fullPathPhoto: recipe.fullPathPhoto });
            }
            setFile({ fullPathFile: recipe.fullPathFile });
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

    const handleInput = (e) => {
        setNewRecipe((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
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
                console.log("photo before", photo);
                if (photo) {
                    console.log("photo", photo);

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
                    setFile({ fullPathFile: snapshot.ref.fullPath });
                });
                setLoading(false);
            })
            .catch((err) => {
                console.log("something went wrong", err);
                setLoading(false);
            });
    };

    const deleteFileFromStorage = (selectedFile) => {
        storage
            .ref()
            .child(file.fullPathFile)
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

    return (
        <div>
            <h1 className="page__title">
                Redigera recept <Radish className="icon" />
            </h1>

            <form className="recipe-form" onSubmit={handleSaveChanges}>
                {loading && (
                    <Loading/>
                )}
                {newRecipe && (
                    <div className="recipe-form__content--file">
                        <Dropzone
                            recipe={newRecipe}
                            file={file}
                            setLoading={setLoading}
                            deleteFileFromStorage={deleteFileFromStorage}
                            addFileToStorage={addFileToStorage}
                        />

                        <ImageUpload
                            handlePhotoChange={handlePhotoChange}
                            recipe={newRecipe}
                        />

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

                        <RecipeFormDescription
                            handleInput={handleInput}
                            recipe={recipe}
                        />

                        <VeganCheckbox
                            handleCheckbox={handleCheckbox}
                            recipe={newRecipe}
                        />
                        <RecipeSubmitButton>Spara recept</RecipeSubmitButton>
                    </div>
                )}
            </form>
        </div>
    );
};

export default EditRecipeWithFile;
