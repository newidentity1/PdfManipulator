var pdfList = new Array();

window.onload = function() {

  var pdfUL = document.getElementById('filesList');
  Sortable.create(pdfUL, {
    ghostClass: "placeholderPdf",
    dragClass: "dragPreview"
  });

    let dropFilesArea = document.getElementById("dropFilesArea");
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
      dropFilesArea.addEventListener(event, function(e) {
        e.preventDefault();
        e.stopPropagation();
        const isEnterEvent = e.type == 'dragenter' || e.type == 'dragover';
        console.log(e.dataTransfer);
        if (isEnterEvent && e.dataTransfer.types.length > 0) 
          dropFilesArea.classList.add('highlight');
        else if (e.dataTransfer.types.length > 0) {
          dropFilesArea.classList.remove('highlight');
          if (e.type == 'drop') {
            document.getElementById('pdfSelected').files = e.dataTransfer.files;
            onFileInputChange();
            document.getElementById("dropFiles").classList.add("hide");
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

 console.log(formData.getAll("pdf[]"));
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
}

