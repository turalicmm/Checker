import React from "react";
import { Link } from "react-router-dom";

import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";

import "./UserItem.css";
const UserItem = (props) => {
  return (
    <li className="user-item">
      <Card className="user-item-content">
        <Link to={`/${props.id}/places`}>
          <div className="user-item-image">
            <Avatar
              image={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
              alt={props.name}
            />
          </div>
          <div className="user-item-info">
            <h2>{props.name}</h2>
            {props.placeCount.length}
            {props.placeCount.length === 1 ? " Place" : " Places"}
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
