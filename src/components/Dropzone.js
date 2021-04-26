import React, { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import { useDropzone } from "react-dropzone";

const Dropzone = ({recipe, file, setLoading, deleteFileFromStorage, addFileToStorage}) => {

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
    } = useDropzone({
        accept: "image/jpeg, image/png",
        onDrop,
    });

    return (
        <div {...getRootProps()} className="recipe-form__dropzone--file">
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
                        <p>Ledsen, fel filtyp, testa jpg eller png </p>
                    )
                ) : recipe.fileUrl === "" ? (
                    <p>Ladda upp recept</p>
                ) : (
                    <p>Byt receptfil</p>
                )}
                {recipe.fileName && <p>{recipe.fileName}</p>}
            </div>
        </div>
    );
};

export default Dropzone;
