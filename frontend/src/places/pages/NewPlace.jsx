import React, { useRef, useContext, useState, useEffect } from "react";
import { AuthContext } from "../../store/auth-context.js";
import ErrorModal from "../../shared/components/UIElements/ErrorModal.jsx";
import { CircularProgress } from "@mui/material";
import Button from "../../shared/components/FormElements/Button";
import { useHttpClient } from "../../shared/hook/http";
import { useNavigate } from "react-router-dom";
import "./NewPlace.css";

const NewPlace = () => {
  const authCtx = useContext(AuthContext);
  const history = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const titleRef = useRef();
  const descriptionRef = useRef();
  const addressRef = useRef();

  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const imageRef = useRef();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", titleRef.current.value);
      formData.append("description", descriptionRef.current.value);
      formData.append("address", addressRef.current.value);
      formData.append("creator", authCtx.userId);
      formData.append("image", file);
      await sendRequest(
        process.env.REACT_APP_BACKED_URL + "/places",
        "POST",
        formData,
        {
          Authorization: "Bearer " + authCtx.token,
        }
      );
      history("/");
    } catch (error) {}
  };

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickImage = () => {
    imageRef.current.click();
  };
  const pickedImage = (e) => {
    let pickedFile;

    if (e.target.files || e.target.files.length === 1) {
      pickedFile = e.target.files[0];
      setFile(pickedFile);
      setIsValid(true);

      return;
    } else {
      setIsValid(false);
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form form-control" onSubmit={submitHandler}>
        {isLoading && <CircularProgress />}
        <label>Title</label>
        <input
          ref={titleRef}
          type="text"
          required={true}
          minLength={3}
          maxLength={20}
        />
        <label>Description</label>
        <textarea
          ref={descriptionRef}
          type="textarea"
          required={true}
          minLength={3}
        />
        <label>Address</label>
        <input ref={addressRef} type="text" required={true} minLength={3} />
        <div className="form-control">
          <input
            type="file"
            style={{ display: "none" }}
            accept=".jpg,.png,.jpeg"
            ref={imageRef}
            onChange={pickedImage}
          />
          <div className={`image-upload  center`}>
            <div className="image-upload-preview">
              {previewUrl && <img src={previewUrl} alt="Preview" />}
              {!previewUrl && <p>Please pick an image</p>}
            </div>
          </div>
          <Button type="button" onClick={pickImage}>
            Upload Image
          </Button>
        </div>
        <Button>Submit</Button>
      </form>
    </>
  );
};

export default NewPlace;
