const axios = require("axios");
const HttpError = require("../models/http-error");

const API = process.env.T_APIKEYGOOGLE;

const getCoords = async (address) => {
  const res = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API}`
  );

  const data = res.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for the specified address.",
      422
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
};

module.exports = getCoords;
