class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
      headers: {
        authorization: "26a66bc9-8fc9-40b5-980e-7373cd063117",
      },
    }).then((res) => res.json());
  }

  // other methods for working with the API
}

export default Api;
