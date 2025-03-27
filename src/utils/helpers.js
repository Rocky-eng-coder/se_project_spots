export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    // set the loading text deleting...
    btn.innerText = loadingText;
    console.log(`Setting text to ${loadingText}`);
  } else {
    // set the not loading text delete for delete button
    btn.innerText = defaultText;
    console.log(`setting text to ${defaultText}`);
  }
}
