import React, { useRef, useState, useContext, useEffect } from "react";

import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

import { AuthContext } from "../../store/auth-context";
import { useHttpClient } from "../../shared/hook/http";

import "./Auth.css";

const Auth = () => {
  const authCtx = useContext(AuthContext);

  const [loginMode, setloginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const emailRef = useRef();
  const passwordRef = useRef();
  const nameRef = useRef();

  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const imageRef = useRef();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (loginMode) {
      //login
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKED_URL}/users/login`,
          "POST",
          JSON.stringify({
            email: emailRef.current.value,
            password: passwordRef.current.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        authCtx.login(responseData.userId, responseData.token);
      } catch (error) {}
    } else {
      //signup

      try {
        const formData = new FormData();
        formData.append("email", emailRef.current.value);
        formData.append("name", nameRef.current.value);
        formData.append("password", passwordRef.current.value);
        formData.append("image", file);
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKED_URL}/users/signup`,
          "POST",
          formData
        );

        authCtx.login(responseData.userId, responseData.token);
      } catch (err) {}
    }
  };

  const toggleMode = () => {
    setloginMode((prevMode) => !prevMode);
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
      <Card className="authentication">
        <h2>Login</h2>
        <form className="place-form form-control" onSubmit={submitHandler}>
          {isLoading && <CircularProgress />}
          {!loginMode && (
            <>
              <label>Name</label>
              <input ref={nameRef} type="text" required={true} minLength={3} />
            </>
          )}
          {!loginMode && (
            <div className="form-control">
              <input
                required={true}
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
              {isValid && <p>Could not upload, please try again</p>}
            </div>
          )}
          <label>E-mail</label>
          <input
            ref={emailRef}
            type="email"
            required={true}
            minLength={3}
          ></input>
          <label>Password</label>
          <input
            ref={passwordRef}
            type="password"
            required={true}
            minLength={6}
          ></input>

          <Button type="submit">{loginMode ? "Login" : "Signup"}</Button>
        </form>
        {loginMode ? (
          <p>Need an account?</p>
        ) : (
          <p>Login to existing account?</p>
        )}

        <Button inverse onClick={toggleMode}>
          {loginMode ? "Create Account" : "Login"}
        </Button>
      </Card>
    </>
  );
};

export default Auth;
