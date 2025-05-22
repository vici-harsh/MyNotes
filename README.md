📒 MyNotes

MyNotes - github
MyNotes is a cross-platform note-taking application developed using React Native. It allows users to create, view, update, and delete personal notes, with support for file and image attachments. The app features an intuitive interface with a customizable background image.
🚀 Features
Create Notes: Add new notes with a title, description, and optional file or image attachments.


View Notes: Browse through a list of saved notes, each displaying its content and associated attachments.


Update Notes: Edit existing notes, including modifying text and replacing attachments.


Delete Notes: Remove notes that are no longer needed.


File and Image Uploads: Attach files and images to notes using the device's file system and image picker.


Custom Background Image: Enhance the app's appearance with a customizable background image.


Cross-Platform: Compatible with both Android and iOS devices.










🖼️ Screenshots.
📱 Home Screen








📝 Add Note Screen



📄 Note Details Screen



🛠️ Installation
To run the MyNotes app locally, follow these steps:
Clone the Repository:



git clone https://github.com/vici-harsh/MyNotes.git
cd MyNotes



Install Dependencies:

 Ensure you have Node.js and React Native CLI installed.
npm install

Link Native Dependencies:

 Some packages may require linking. Use the following command:


npx react-native link

Run the Application:
For Android:


npx react-native run-android


For iOS:


npx react-native run-ios





📂 Project Structure

MyNotes/
├── assets/             # Image and font assets
├── components/         # Reusable components (e.g., NoteCard, NoteForm)
├── screens/            # Screen components (e.g., HomeScreen, AddNoteScreen)
├── App.js              # Entry point of the application
├── android/            # Android-specific files
├── ios/                # iOS-specific files
├── package.json        # Project metadata and dependencies
└── README.md           # Project documentation


📦 Dependencies
React Native


React Navigation


AsyncStorage (for local data persistence)


React Native Image Picker (for selecting images)


React Native FS (for handling file uploads)


React Native ImageBackground (for setting background images)


Note: Ensure all dependencies are installed and properly configured.
📌 Notes
Data is stored locally on the device using AsyncStorage. Clearing app data or uninstalling the app will remove all notes.


For a production-ready app, consider integrating a backend service for data storage and user authentication.


📄 License
This project is licensed under the MIT License.


