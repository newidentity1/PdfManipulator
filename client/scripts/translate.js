function changeLanguage(languageSelect) {
  fetch("language/" + languageSelect.value + ".json")
  .then(response => response.json())
  .then(responseJson => translateText(responseJson));
}

function translateText(translationJson) {
  const elementsToTranslate = document.querySelectorAll("[data-translate]");
  for (const element of elementsToTranslate) {
      const key = element.getAttribute("data-translate");
      element.textContent = translationJson[key];
  }
}
