import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import { setButtonText } from "../utils/helpers.js";
import Api from "../utils/Api.js";

const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Golden Gate bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "26a66bc9-8fc9-40b5-980e-7373cd063117",
    "Content-Type": "application/json",
  },
});

// Destructure the second item in the callback of the .then()
api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    const profileAvatar = document.querySelector(".profile__avatar");
    if (profileAvatar) {
      profileAvatar.src = userInfo.avatar;
    }

    cards.forEach((item) => {
      const cardEl = getCardElement(item);
      cardsList.append(cardEl);
    });

    //Handle the user's information
    // - set the src of the avatar image
    // - set the textcontent of both the text elements
  })
  .catch(console.error);

//Profile elements
const profileEditButton = document.querySelector(".profile__edit-btn");
const profileAddButton = document.querySelector(".profile__add-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

//form Elements
const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");

const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

// Avatar form elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

// Delete form Elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");
const cardCancelBtn = deleteModal.querySelector(".modal__cancel-btn");

// select the modal
const previewModal = document.querySelector("#preview-modal");
// select other necessary elements// Card related elements
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalDeleteBtn = previewModal.querySelector(
  ".modal__close-btn_preview"
);

const previewModalErrorMsg = previewModal.querySelector(".modal__error");

// CARD RELATED ELEMENTS //

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

let selectedCard, selectedCardId;

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  const cardLikeBtn = cardElement.querySelector(".card__like-btn");

  console.log(cardElement);

  //TODO - Select the delete button
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  // TODO ... if the card is liked, set the active class on the card, liked cards should be liked when page is refreshed

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_liked");
  } else {
    cardLikeBtn.classList.remove("card__like-btn_liked");
  }

  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-btn_liked");
  });

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.alt = data.name;
    previewModalImageEl.src = data.link;
    previewModalCaptionEl.textContent = data.name;
  });

  previewModalDeleteBtn.addEventListener("click", () => {
    closeModal(previewModal);
  });

  // add the src
  // add the text content

  //set the listener on the delete button
  // The handler should remove the card from the Dom

  cardLikeBtn.addEventListener("click", (evt) =>
    changeLikeStatus(evt, data._id)
  );
  cardDeleteBtn.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

  return cardElement;
}

// Add code for clicking overlay

const modals = document.querySelectorAll(".modal");

function changeLikeStatus(evt, id) {
  const cardLikeBtn = evt.target;
  const isLiked = cardLikeBtn.classList.contains("card__like-btn_liked");

  api
    .changeLikeStatus(id, !isLiked)
    .then((data) => {
      cardLikeBtn.classList.toggle("card__like-btn-liked");
      // Optionally toggle button class here
    })
    .catch((error) => {
      console.error("Error updating like status:", error);
    });
}

function openModal(modal) {
  const openModals = document.querySelectorAll(".modal_opened");
  openModals.forEach((modal) => closeModal(modal));

  modal.classList.add("modal_opened");
  modal.addEventListener("click", handleOverlayClick);
  document.addEventListener("keydown", handleEscapeKey);
}
function closeModal(modal) {
  console.log("closing modal...");
  modal.classList.remove("modal_opened");
  modal.removeEventListener("click", handleOverlayClick);
  document.removeEventListener("keydown", handleEscapeKey);
}

// Add code for leaving modal using ESC key

function handleOverlayClick(evt) {
  if (evt.target.classList.contains("modal_opened")) {
    closeModal(evt.target);
  }
}

function handleEscapeKey(event) {
  if (event.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    closeModal(openedModal);
  }
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();

  // change text content to "saving..."
  const submitBtn = evt.submitter;
  // submitBtn.textContent = "saving...";
  setButtonText(submitBtn, true, "Save", "Saving...");

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      // Todo - Use data argument instead of the input values
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      // TODO Call setButtonText instead
      setButtonText(submitBtn, false, "Save", "Saving...");
    });
}

// TODO - implement loading text for all other form submissions

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;

  setButtonText(submitBtn, true, "save", "saving...");

  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  api
    .addCard(inputValues)
    .then((res) => {
      // renderCard(res, "prepend"); // optional

      const cardEl = getCardElement(res);
      cardsList.prepend(cardEl);
      evt.target.reset(settings);
      disableButton(cardSubmitBtn, settings);
      closeModal(cardModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "save", "saving...");
    });
}

// TODO - FINISH avatar submission handler
function handleAvatarSubmit(evt) {
  evt.preventDefault();

  const newAvatarUrl = avatarInput.value;

  // TODO - prevent behavior
  // TODO - Call api.editAvatarUserInfo

  if (!newAvatarUrl) {
    return;
  }

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Save", "Saving...");

  api
    .editAvatarInfo(newAvatarUrl)
    .then((data) => {
      console.log(data.avatar);
      // make this work- add the src request
      const profileAvatar = document.querySelector(".profile__avatar");
      if (profileAvatar) {
        profileAvatar.src = data.avatar;
      }
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Save", "saving...");
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Delete", "Deleting...");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
      const selectedCardElement = document.querySelector(
        `#card-${selectedCardId}`
      );
      if (selectedCardElement) {
        selectedCardElement.remove();
      }
      // TODO //
      // REMOVE THE CARD FROM THE DOM
      // CLOSE THE MODAL
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Delete", "Deleting...");
    });
}

function handleDeleteCard(cardElement, id) {
  selectedCard = cardElement;
  selectedCardId = id;

  const openModals = document.querySelectorAll(".modal_opened");
  openModals.forEach((modal) => closeModal(modal));
  openModal(deleteModal);
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});

profileAddButton.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

cardCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteModalCloseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

// TODO - select avatar modal button at the top of the page
avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

deleteForm.addEventListener("submit", handleDeleteSubmit);

// for (let i = 0; i < initialCards.length; i++) {
//  const cardElement = getCardElement(initialCards[i]);
// cardsList.prepend(cardElement);
//}

enableValidation(settings);
