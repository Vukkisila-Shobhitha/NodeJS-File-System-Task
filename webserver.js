const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const PORT = process.env.PORT || 3001;

// API to create a file with current timestamp
app.get("/", (req, res) => {
  // Create files directory if not exists
  if (!fs.existsSync(path.join(__dirname, "files"))) {
    fs.mkdirSync(path.join(__dirname, "files"));
  }

  const date = new Date();
  //   File Name Format: DD-MM-YYYY_HH-MM-SS AM/PM
  const fileName = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}_${
    date.getHours() - 12
  }-${date.getMinutes()}-${date.getSeconds()}${
    date.getHours() < 12 ? "AM" : "PM"
  }.txt`;

  //   File Content
  const filecontent = `Current Time Stamp: ${date}`;

  //   Write File
  fs.writeFile(path.join(__dirname, "files", fileName), filecontent, (err) => {
    if (err) {
      console.log(err);
      return res.status(404).json({ message: "Error Occured" });
    } else {
      console.log(`File ${fileName} Created Successfully`);
      res.status(200).json({
        message: "File Created Successfully",
        fileName: fileName,
      });
    }
  });
});

// API to read all files in the "files" directory
app.get("/readfile", (req, res) => {
  // Read files in the "files" directory
  fs.readdir(path.join(__dirname, "files"), (err, files = []) => {
    // Check for errors
    if (err) {
      console.log(err);
      return res.status(404).json({ message: "Error Occured" });
    } else {
      files.forEach((file) => {
        const itemPath = path.join(__dirname, "files");
        const stat = fs.statSync(itemPath);

        // Check if item is a file or a folder
        if (!stat.isDirectory()) {
          console.log(`${file} => Folder`);
        } else {
          console.log(`${file} => File`);
        }
      });
    }

    // Check if no files are found
    if (!files.length) {
      res.json({ message: "No Files Found" });
      console.log("No Files Found");
    } else {
      res.status(200).json({ files });
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:3001 port`);
});