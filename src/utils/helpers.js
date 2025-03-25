export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    (defaultText = "Delete"), (loadingText = "Deleting...");
    // set the loading text deleting...
    console.log(`Setting text to ${loadingText}`);
  } else {
    // set the not loading text delete for delete button
  }
}
