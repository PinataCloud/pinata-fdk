#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const appRoot = require('app-root-path');
const FormData = require('form-data')
const axios = require('axios')
const pinFolder = `${appRoot}/src/pins`;

const pinFileToIPFS = async (fileName) => {
    const formData = new FormData();
    const src = `${pinFolder}/${fileName}`;
    
    const file = fs.createReadStream(src)
    formData.append('file', file)
    
    const pinataMetadata = JSON.stringify({
      name: fileName,
    });
    formData.append('pinataMetadata', pinataMetadata);
    
    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', pinataOptions);

    try{
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity",
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          'Authorization': `Bearer ${JWT}`
        }
      });
      return res.data
    } catch (error) {
      console.log(error);
    }
}


// Specify the folder and file name
const fileName = 'pin_list.json';
const filePath = path.join(pinFolder, fileName);
console.log("Uploading files from:", pinFolder);

// Accept the JWT from command line arguments
const JWT = process.argv[2]; 

if (!JWT) {
    console.log("Please provide your PINATA JWT as an argument.");
    process.exit(1); // Exit the script with an error code
}

// Check if the pin_list.json file exists
if (!fs.existsSync(filePath)) {
    // Create the file with an empty array of pins
    fs.writeFileSync(filePath, JSON.stringify({ pins: [] }));
}

// Read the current contents of pin_list.json
const fileContents = fs.readFileSync(filePath, 'utf-8');
const pinList = JSON.parse(fileContents);
const pins = pinList.pins;

// Read the contents of the pinFolder
fs.readdir(pinFolder, (err, files) => {
    if (err) {
        console.error("Error reading directory:", err);
        return;
    }

    // Filter out non-image files
    const imageFiles = files.filter((file) => {
        const extension = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif'].includes(extension);
    });

    // Process each image file
    imageFiles.forEach((imageFile) => {
        // Check if the image file is already on the list
        const existingPin = pins.find((pin) => pin.fileName === imageFile);
        if (!existingPin) {
            try{
            // Image file not on the list, add it to the list and upload
                pinFileToIPFS(imageFile).then((result) => {
                const cid = result.IpfsHash 
                if(!cid) {
                    return console.log("Error uploading:", imageFile);
                }
                const pinData = { fileName: imageFile, cid: cid };
                pins.push(pinData); // Add pin data to the array
                fs.writeFileSync(filePath, JSON.stringify(pinList, null, 2))})
            } catch (error) {
                console.log(error);
            }    
        } else {
            console.log("Skipping:", imageFile, "- Already pinned.");
        }
    });
    console.log("Pinned files uploaded successfully!");
});
