# MetaManager 
##### An app to rule them all

***

Electron application to control many metabots (and bots) simultaneously. It interacts with [i-score](https://github.com/OSSIA/i-score)

First be sure to have NodeJS and Npm installed on your computer : `sudo apt-get install nodejs npm` (or yum, pacman ...)

To run the app : `npm install && npm start`

If you want to send OSC Messages, be careful : problem with node OSC. Line 72 osc-transport.js, need to convert the Uint8Array to Buffer.
Concerning bluetooth, the version 1.2.x of Electron-prebuilt is making serial-port library a nightmare. So you can't use version 1.2.x until it is fixed.

To package the app : `npm install && npm run-script package`

You'll find in directory "dist" the packaged version of the app for each possible platform.