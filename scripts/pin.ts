#!/usr/bin/env node
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const appRoot = require('app-root-path');
const pinataSDK = require('@pinata/sdk');
dotenv.config();

const pinFolder = `${appRoot}/src/pins`;

// Specify the folder and file name
const fileName = 'pin_list.json';
const filePath = path.join(pinFolder, fileName);
console.log("Uploading files from:", pinFolder);
if(!process.env.PINATA_JWT) {
    console.log("Please set your PINATA_JWT in a .env file");
    throw new Error("PINATA_JWT not set");
}

const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });

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
fs.readdir(pinFolder, (err: any, files:any) => {
    if (err) {
        console.error("Error reading directory:", err);
        return;
    }

    // Filter out non-image files
    const imageFiles = files.filter((file: any) => {
        const extension = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif'].includes(extension);
    });

    // Process each image file
    imageFiles.forEach((imageFile: any) => {
        // Check if the image file is already on the list
        const existingPin = pins.find((pin: any) => pin.fileName === imageFile);
        if (!existingPin) {
            // Image file not on the list, add it to the list and upload
            const imageStream = fs.createReadStream(path.join(pinFolder, imageFile));
            const options = {
                pinataMetadata: {
                    name: imageFile,
                },
                pinataOptions: {
                    cidVersion: 0
                }
            }
            try {
                console.log("Uploading:", imageFile);
                pinata.pinFileToIPFS(imageStream, options).then((result: any) => {
                const cid = result.IpfsHash 
                if(!cid) {
                    return console.log("Error uploading:", imageFile);
                }
                const pinData = { fileName: imageFile, cid: cid };
                pins.push(pinData); // Add pin data to the array
                fs.writeFileSync(filePath, JSON.stringify(pinList, null, 2));
              }).catch((err: any) => {console.log(err)})
            } catch (error) {
              return error
            }
        } else {
            console.log("Skipping:", imageFile, "- Already pinned.");
        }
    });
    console.log("Pinned files uploaded successfully!");

});
