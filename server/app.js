"use strict";
const express = require("express");
const multer = require("multer");
const PdfLib = require("pdf-lib");
const path = require("path");
const fs = require('fs');

const PDFDocument = PdfLib.PDFDocument;
const port = 3000;
const app = express();

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

app.use(express.json());
app.use(express.urlencoded());


async function createPdf(pdfFiles) {
  const mergedPdfDoc = await PDFDocument.create();
  for (const pdfFileString of pdfFiles) {
    const pdfFile = JSON.parse(pdfFileString);
    const pdf = await PDFDocument.load(fs.readFileSync(pdfFile["path"]));
    const copyPdf = await mergedPdfDoc.copyPages(pdf, pdf.getPageIndices());
    copyPdf.forEach((page)=> mergedPdfDoc.addPage(page));
  }

  const pdfBytes = await mergedPdfDoc.save();
  const pdfFileName =  "uploads/" + "merged" + Date.now() + ".pdf";
  if (!fs.existsSync("uploads/")) fs.mkdirSync("uploads/");
  fs.appendFileSync(pdfFileName, pdfBytes);
  return pdfFileName;
}

app.post("/", (req, res) => {
    const uploadPdf = multer({
      storage: storage,
    }).array("pdf[]");
    uploadPdf(req, res, function(err) {
      const files = req.body.pdf;
      createPdf(files)
        .then(function (pdfFileName) {
          res.status(200);
          res.type("pdf");
          res.download(pdfFileName, function(err) {
            fs.rmdirSync("uploads/", {recursive:true});
          });
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
