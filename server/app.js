const express = require("express");
const multer = require("multer");
const PdfLib = require("pdf-lib");
const path = require("path");

const PDFDocument = PdfLib.PDFDocument;
const port = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

async function createPdf() {
  var pdfDoc = await PDFDocument.create();
  var page = pdfDoc.addPage();
  
  var pdfBytes = await pdfDoc.save();
  var pdfBuffer = Buffer.from(pdfBytes.buffer, "binary");
  return pdfBuffer;
}

app.post("/", (req, res) => {
    const uploadPdf= multer({
      storage: storage,
    }).array("pdfs_selected", 10);

    uploadPdf(req, res, function(err) {

        const files = req.files;
    });
// createPdf()
//   .then(function (pdfBuffer) {
//     res.status(200);
//     res.type("pdf");
//     res.send(pdfBuffer);
//   })
//   .catch(function (err) {
//     res.status(500);
//     res.send(err.message);
//   });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
