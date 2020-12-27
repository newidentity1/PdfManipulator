var pdfList = new Array();

function onCombinePdf() {
 var formData = new FormData();
 var file = {};
 var index = 1;
 for (const pdf of pdfList) {
     file = {
         'index': index++,
          'name': pdf.name,
          'path': pdf.path,
     }
     formData.append("pdf[]", JSON.stringify(file));
 }

 fetch("http://localhost:3000/", {
   method: "POST",
   body: formData,
 })
   .then((response) => {
         response.blob().then(function (blob) {
             const mergedPdfUrl = window.URL.createObjectURL(blob);
             downloadPdf(mergedPdfUrl);   
         }); 
   });
}

function onFileInputChange() {
    var pdfAddedList = document.getElementById('pdfs_selected').files;
    const pdfListWrapper = document.getElementById("filesList");
    for (const pdf of pdfAddedList) {
        pdfList.push(pdf);
        const pdfListElem = document.createElement("li")
        pdfListElem.innerHTML = pdf.name;
        pdfListWrapper.append(pdfListElem);
    }
    document.getElementById("pdfs_selected").value = "";
}

function downloadPdf(url) {
  var a = document.createElement("a");
  a.href = url;
  const filename = "merged.pdf";
  a.setAttribute("download", filename);
  a.click();
  delete a;
}
