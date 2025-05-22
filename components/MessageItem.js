import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Linking, Button } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDirectory } from '../context/DirectoryContext';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

const MessageItem = ({ message, directoryId }) => {
  const { deleteMessage, updateMessage, directories } = useDirectory();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.text);
  const [editedImages, setEditedImages] = useState(message.imageUris || []);
  const [editedFiles, setEditedFiles] = useState(message.fileUris || []);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const currentDir = directories.find(dir => dir.id === directoryId);
  const bgColor = currentDir?.chatBgColor || '#DCF8C6';

  const handleSave = () => {
    updateMessage(directoryId, message.id, {
      text: editedText,
      imageUris: editedImages,
      fileUris: editedFiles,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      deleteMessage(directoryId, message.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      setEditedImages([...editedImages, ...result.assets.map(asset => asset.uri)]);
    }
  };

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
      multiple: true,
    });

    if (!result.canceled) {
      setEditedFiles([...editedFiles, ...result.assets.map(asset => asset.uri)]);
    }
  };

  const removeImage = (index) => {
    setEditedImages(editedImages.filter((_, i) => i !== index));
  };

  const removeFile = (index) => {
    setEditedFiles(editedFiles.filter((_, i) => i !== index));
  };

  const handleOpenFile = (uri) => {
    Linking.openURL(uri).catch(err => console.error("Couldn't open file", err));
  };

  return (
    <View style={[styles.messageContainer, { backgroundColor: bgColor }]}>
      {isEditing ? (
        <>
          <TextInput
            style={styles.editInput}
            value={editedText}
            onChangeText={setEditedText}
            autoFocus
            multiline
          />
          <View style={styles.editButtons}>
            <Button title="Add Images" onPress={pickImage} />
            <Button title="Add Files" onPress={pickFile} />
          </View>

          {editedImages.map((uri, index) => (
            <View key={index} style={styles.editMediaItem}>
              <Image source={{ uri }} style={styles.previewImage} />
              <TouchableOpacity onPress={() => removeImage(index)}>
                <MaterialIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}

          {editedFiles.map((uri, index) => (
            <View key={index} style={styles.editMediaItem}>
              <Text>{uri.split('/').pop()}</Text>
              <TouchableOpacity onPress={() => removeFile(index)}>
                <MaterialIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </>
      ) : (
        <>
          {message.text && <Text style={styles.messageText}>{message.text}</Text>}

          {message.imageUris?.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.messageImage} />
          ))}

          {message.fileUris?.map((uri, index) => (
            <TouchableOpacity key={index} style={styles.fileContainer} onPress={() => handleOpenFile(uri)}>
              <MaterialIcons name="insert-drive-file" size={24} />
              <Text>{uri.split('/').pop()}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      <View style={styles.footer}>
        <TouchableOpacity onPress={isEditing ? handleSave : () => setIsEditing(true)}>
          <MaterialIcons name={isEditing ? 'check' : 'edit'} size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
          <MaterialIcons name="delete" size={24} color={confirmDelete ? "red" : "gray"} />
        </TouchableOpacity>
        {confirmDelete && <Text style={styles.confirmText}>Confirm?</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    margin: 8,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editInput: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  editMediaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewImage: {
    width: 100,
    height: 100,
    marginRight: 8,
  },
  messageText: {
    marginBottom: 8,
  },
  messageImage: {
    width: 200,
    height: 200,
    marginBottom: 8,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
  },
  confirmText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 8,
  },
});

export default MessageItem;
