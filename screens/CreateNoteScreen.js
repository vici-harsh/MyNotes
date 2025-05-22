import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, ScrollView, Animated, Easing, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useDirectory } from '../context/DirectoryContext';
import { MaterialIcons } from '@expo/vector-icons';


const CreateNoteScreen = ({ navigation, route }) => {
  const [text, setText] = useState('');
  const [imageUris, setImageUris] = useState([]);
  const [fileUris, setFileUris] = useState([]);
  const { addMessage } = useDirectory();
  const { directoryId } = route.params;
  const [animation] = useState(new Animated.Value(0));

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUris([...imageUris, ...result.assets.map(a => a.uri)]);
      animateButton();
    }
  };

  const pickFiles = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      multiple: true,
    });
    if (!result.canceled) {
      setFileUris([...fileUris, ...result.assets.map(a => a.uri)]);
      animateButton();
    }
  };

  const animateButton = () => {
    animation.setValue(0);
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      easing: Easing.elastic(1),
      useNativeDriver: true,
    }).start();
  };

  const removeImage = (index) => {
    setImageUris(imageUris.filter((_, i) => i !== index));
  };

  const removeFile = (index) => {
    setFileUris(fileUris.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (text.trim() || imageUris.length > 0 || fileUris.length > 0) {
      addMessage(directoryId, text, imageUris, fileUris);
      navigation.goBack();
    }
  };

  const buttonScale = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1]
  });

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your note..."
        placeholderTextColor="#888"
        multiline
        value={text}
        onChangeText={setText}
      />
      
      <View style={styles.buttonGroup}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity style={styles.addButton} onPress={pickImages}>
            <MaterialIcons name="add-photo-alternate" size={24} color="white" />
            <Text style={styles.buttonText}>Add Images</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity style={styles.addButton} onPress={pickFiles}>
            <MaterialIcons name="attach-file" size={24} color="white" />
            <Text style={styles.buttonText}>Add Files</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {imageUris.map((uri, i) => (
        <View key={i} style={styles.mediaItem}>
          <Image source={{ uri }} style={styles.previewImage} />
          <TouchableOpacity 
            style={styles.removeButton} 
            onPress={() => removeImage(i)}
          >
            <MaterialIcons name="close" size={20} color="white" />
          </TouchableOpacity>
        </View>
      ))}
      
      {fileUris.map((uri, i) => (
        <View key={i} style={styles.mediaItem}>
          <MaterialIcons name="insert-drive-file" size={24} color="#555" />
          <Text style={styles.fileName}>{uri.split('/').pop()}</Text>
          <TouchableOpacity 
            style={styles.removeButton} 
            onPress={() => removeFile(i)}
          >
            <MaterialIcons name="close" size={20} color="white" />
          </TouchableOpacity>
        </View>
      ))}
      
      <TouchableOpacity 
        style={styles.saveButton}
        onPress={handleSave}
        disabled={!text.trim() && imageUris.length === 0 && fileUris.length === 0}
      >
        <Text style={styles.saveButtonText}>Save Note</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  input: {
    minHeight: 150,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: 'white',
    textAlignVertical: 'top',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4285F4',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '500',
  },
  mediaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 10,
  },
  fileName: {
    flex: 1,
    marginLeft: 8,
    color: '#333',
  },
  removeButton: {
    backgroundColor: '#ff4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#34A853',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    elevation: 2,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateNoteScreen;