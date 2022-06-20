import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { CircularProgress } from "@mui/material";

import { useHttpClient } from "../../shared/hook/http";
import { AuthContext } from "../../store/auth-context";
import "./PlaceItem.css";

const PlaceItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const authCtx = useContext(AuthContext);

  const [showMap, setShowMap] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteModal = () => {
    setConfirmModal(true);
  };

  const hideDeleteModal = () => {
    setConfirmModal(false);
  };

  const deleteModal = async () => {
    setConfirmModal(false);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKED_URL}/places/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + authCtx.token,
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item-modal-content"
        footerClass="place-item-modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={confirmModal}
        onCancel={hideDeleteModal}
        header="Are you sure?"
        footerClass="place-item-modal-actions"
        footer={
          <>
            <Button inverse onClick={hideDeleteModal}>
              Cancel
            </Button>
            <Button danger onClick={deleteModal}>
              Delete
            </Button>
          </>
        }
      >
        <p>Do you want to proceed and delete this place?</p>
      </Modal>
      <li className="place-item">
        <Card className="place-item-content">
          {isLoading && <CircularProgress />}
          <div className="place-item-image">
            <img
              src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="place-item-info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item-actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {authCtx.userId === props.creatorId && (
              <>
                <Button to={`/places/${props.id}`}>EDIT</Button>
                <Button danger onClick={showDeleteModal}>
                  DELETE
                </Button>
              </>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
