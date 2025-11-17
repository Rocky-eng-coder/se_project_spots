export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    btn.innerText = loadingText;
    console.log(`Setting text to ${loadingText}`);
  } else {
    btn.innerText = defaultText;
    console.log(`setting text to ${defaultText}`);
  }
}
