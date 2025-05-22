import React, { useState } from 'react';
import { View, TextInput, Modal, Button, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ColorPicker from 'react-native-wheel-color-picker';
import IconPicker from './IconPicker';
import * as ImagePicker from 'expo-image-picker';

const CreateDirectoryModal = ({ visible, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('folder');
  const [chatBgColor, setChatBgColor] = useState('#DCF8C6');
  const [bgImageUri, setBgImageUri] = useState(null);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const pickBackgroundImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setBgImageUri(result.assets[0].uri);
    }
  };

  const handleCreate = () => {
    if (name.trim()) {
      onCreate(name, icon, chatBgColor, bgImageUri);
      setName('');
      setIcon('folder');
      setChatBgColor('#DCF8C6');
      setBgImageUri(null);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Create New Folder</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Folder name"
            value={name}
            onChangeText={setName}
            autoFocus
          />
          
          <TouchableOpacity 
            style={styles.iconSelector}
            onPress={() => setShowIconPicker(true)}
          >
            <Text>Folder Icon:</Text>
            <View style={styles.iconPreview}>
              <MaterialIcons name={icon} size={24} color="#333" />
            </View>
          </TouchableOpacity>

          <View style={styles.section}>
            <Text>Chat Background:</Text>
            <View style={styles.bgOptions}>
              <TouchableOpacity 
                style={styles.bgOptionButton}
                onPress={() => setChatBgColor('#DCF8C6')}
              >
                <Text>Color</Text>
                <View style={[styles.colorPreview, { backgroundColor: chatBgColor }]} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.bgOptionButton}
                onPress={pickBackgroundImage}
              >
                <Text>Image</Text>
                {bgImageUri ? (
                  <Image 
                    source={{ uri: bgImageUri }} 
                    style={styles.imagePreview}
                  />
                ) : (
                  <MaterialIcons name="image" size={24} color="#333" />
                )}
              </TouchableOpacity>
            </View>
            
            {!bgImageUri && (
              <ColorPicker
                color={chatBgColor}
                onColorChange={setChatBgColor}
                thumbSize={30}
                sliderSize={30}
              />
            )}
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={onClose} />
            <Button title="Create" onPress={handleCreate} />
          </View>
        </View>
      </View>

      <IconPicker
        visible={showIconPicker}
        onSelect={(selectedIcon) => {
          setIcon(selectedIcon);
          setShowIconPicker(false);
        }}
        onClose={() => setShowIconPicker(false)}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  iconSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconPreview: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  section: {
    marginBottom: 15,
  },
  bgOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bgOptionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  colorPreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginTop: 5,
  },
  imagePreview: {
    width: 30,
    height: 30,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default CreateDirectoryModal;