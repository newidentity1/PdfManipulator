var pdfList = new Array();

window.onload = function() {
  checkButton();

  var pdfUL = document.getElementById('filesList');
  Sortable.create(pdfUL, {
    ghostClass: "placeholderPdf",
    dragClass: "dragPreview",
    dragoverBubble: false
  });

    let insertFilesWrapper = document.getElementById("insertFilesWrapper");
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
      insertFilesWrapper.addEventListener(event, function(e) {
        e.preventDefault();
        e.stopPropagation();
        const isEnterEvent = e.type == 'dragenter' || e.type == 'dragover';
        if (isEnterEvent && !Sortable.active) 
          insertFilesWrapper.classList.add('highlight');
        else if (!Sortable.active) {
          insertFilesWrapper.classList.remove('highlight');
          if (e.type == 'drop') {
            document.getElementById('pdfSelected').files = e.dataTransfer.files;
            onFileInputChange();
          }
        }
        
      })
  });
}

function onCombinePdf() {
 orderPdfs();
 var formData = new FormData();
 var file = {};
 for (const pdf of pdfList) {
     file = {
          'index': pdf.index,
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
    if (!response.ok) {   
      response.text().then((errorMessage)=> {
         alert("Error: " + errorMessage); 
      })
    } else {
      response.blob().then(function (blob) {
        const mergedPdfUrl = window.URL.createObjectURL(blob);
        downloadPdf(mergedPdfUrl);   
      }); 
    }
   }).catch(
   (error) => {
     alert("Error", error);
   });
}

function orderPdfs() {
  const orderedPdfs = document.getElementById("filesList").getElementsByTagName("li");
  const orderedPdfList = new Array();
  for (const pdfElement of orderedPdfs) {
      const pdfName = pdfElement.getElementsByTagName('p')[0].innerHTML;
      orderedPdfList.push(findPdfWithName(pdfName));
  }
  pdfList = orderedPdfList;
}

function findPdfWithName(pdfName) {
  for (const pdf of pdfList) {
    if (pdf.name == pdfName) {
      return pdf;
    }
  }
}

function onFileInputChange() {
    var pdfAddedList = document.getElementById('pdfSelected').files;
    const pdfListWrapper = document.getElementById("filesList");
    for (const pdf of pdfAddedList) {
        pdf.index = pdfList.length;
        pdfList.push(pdf);
        const pdfListElem = document.createElement("li")
        pdfListElem.className = "list-group-item";
        pdfListElem.innerHTML = '<span><i class="fa fa-bars" aria-hidden="true"></i></span>' + "<p>"+pdf.name+"</p>";
        const buttonDelete = document.createElement('button');
        buttonDelete.className = "deleteFileButton";
        buttonDelete.innerHTML =
          '<span><i class="fa fa-trash"></i></span>';
        buttonDelete.addEventListener("click", function() {onDeleteFile(pdf.index)});
        pdfListElem.append(buttonDelete);
        pdfListWrapper.append(pdfListElem);
    }
    document.getElementById("pdfSelected").value = "";
    checkButton();
}

function downloadPdf(url) {
  var downloadPdf = document.createElement("a");
  downloadPdf.href = url;
  const filename = "merged.pdf";
  downloadPdf.setAttribute("download", filename);
  downloadPdf.click();
}

function onDeleteFile(fileIndex) {
    pdfList.splice(fileIndex, 1);
    const pdfListWrapper = document.getElementById("filesList");
    pdfListWrapper.innerHTML = "";
    for (const pdf of pdfList) {
      pdfListWrapper.append(createPdfListElem(pdf, fileIndex)); 
    }
    document.getElementById("pdfSelected").value = "";
    checkButton();
}

function createPdfListElem(pdf, index=pdfList.length) {
    if (pdf.index > index) {
        pdf.index = pdf.index - 1;
    }
   const pdfListElem = document.createElement("li")
   pdfListElem.className = "list-group-item";
   pdfListElem.innerHTML = '<span><i class="fa fa-bars" aria-hidden="true"></i></span>' + "<p>"+pdf.name+"</p>";

    const buttonDelete = document.createElement('button');
    buttonDelete.className = "deleteFileButton";
    buttonDelete.innerHTML =
          '<span><i class="fa fa-trash"></i></span>';
    buttonDelete.addEventListener("click", function() {
    onDeleteFile(pdf.index)});
    pdfListElem.append(buttonDelete);
    return pdfListElem;
}

function onResetFiles() {
    pdfList = new Array();
    document.getElementById("filesList").innerHTML = '';
    onFileInputChange();
    document.getElementById("dropFiles").classList.remove("hide");
    checkButton();
}

function checkButton() {
  if (pdfList.length > 1) 
    enableCombineButton();
  else 
    disableCombineButton();
}

function enableCombineButton() {
  document.getElementById("combineButton").disabled = false;
}

function disableCombineButton() {
  document.getElementById("combineButton").disabled = true;
}


