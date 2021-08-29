// postRandom
// fetchTweet

"use strict";

const { fetchTweet, postRandom } = require("./src/controller");

module.exports.fetchTweets = async (event, context) => {
  await fetchTweet();
  return {
    statusCode: 200,
    body: "OK",
  };
};

module.exports.postRandom = async (event, context) => {
  const data = await postRandom();
  return {
    statusCode: 200,
    body: data,
  };
};
