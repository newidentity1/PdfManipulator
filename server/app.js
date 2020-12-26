"use strict";
const express = require("express");
const multer = require("multer");
const PdfLib = require("pdf-lib");
const path = require("path");
const fs = require('fs');

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

async function createPdf(pdfFiles) {
  var mergedPdfDoc = await PDFDocument.create();

  for (const pdfFile of pdfFiles) {
    const pdf = await PDFDocument.load(fs.readFileSync(pdfFile.path));
    const copyPdf = await mergedPdfDoc.copyPages(pdf, pdf.getPageIndices());
    copyPdf.forEach((page)=> mergedPdfDoc.addPage(page));
  }

  var pdfBytes = await mergedPdfDoc.save();
  var pdfBuffer = Buffer.from(pdfBytes.buffer, "binary");
  return pdfBuffer;
}

app.post("/", (req, res) => {
    const uploadPdf= multer({
      storage: storage,
    }).array("pdfs_selected", 10);

    uploadPdf(req, res, function(err) {
      const files = req.files;
      createPdf(files)
        .then(function (pdfBuffer) {
          res.status(200);
          res.type("pdf");
          res.send(pdfBuffer);
        })
        .catch(function (err) {
          res.status(500);
          res.send(err.message);
        });
    });

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
