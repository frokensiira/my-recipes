import React from "react";
import placeholder from "../assets/images/placeholder.png";
import { ReactComponent as AddImage } from "../assets/plus.svg";

const ImageUpload = ({ recipe, handlePhotoChange }) => {
    console.log("recipe.photoUrl", recipe.photoUrl);

    return (
        <label className="recipe-form__image-upload" htmlFor="photo">
            <input type="file" id="photo" onChange={handlePhotoChange} />
            <div className="recipe-form__image">
                {recipe.photoUrl ? (
                    <>
                        <img src={recipe.photoUrl} alt="presentation" />
                        <p className="recipe-form__image-text">Byt bild</p>
                    </>
                ) : (
                    <>
                        <img src={placeholder} alt="placeholder" />
                        <div className="recipe-form__overlay"></div>
                        <p className="recipe-form__image-text">
                            Lägg till bild
                        </p>
                    </>
                )}
                <AddImage className="recipe-form__icon-plus" />
            </div>
        </label>
    );
};

export default ImageUpload;
