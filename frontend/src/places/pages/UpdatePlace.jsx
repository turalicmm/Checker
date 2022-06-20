import React, { useRef, useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useHttpClient } from "../../shared/hook/http";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { CircularProgress } from "@mui/material";
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../store/auth-context";

import "./NewPlace.css";

const UpdatePlace = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedState, setLoadedState] = useState();

  const authCtx = useContext(AuthContext);

  const titleRef = useRef();
  const descriptionRef = useRef();
  const navigate = useNavigate();

  const idParam = useParams().id;

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKED_URL}/places/${idParam}`
        );
        setLoadedState(responseData.place);
      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, idParam]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKED_URL}/places/${idParam}`,
        "PATCH",
        JSON.stringify({
          title: titleRef.current.value,
          description: descriptionRef.current.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        }
      );
      navigate("/" + authCtx.userId + "/places");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <CircularProgress />
      </div>
    );
  }

  if (!loadedState) {
    return (
      <div className="center">
        <h2>Could not find place!</h2>
      </div>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form form-control" onSubmit={submitHandler}>
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
          type="text"
          required={true}
          minLength={3}
        />
        <Button type="submit">Update</Button>
      </form>
    </>
  );
};

export default UpdatePlace;
