import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { View, FlatList, TouchableOpacity, Modal, StyleSheet, Button } from 'react-native';

const icons = [
  'folder', 'book', 'star', 'favorite', 'work', 
  'home', 'school', 'note', 'insert-drive-file', 'collections',
  'image', 'photo', 'picture-as-pdf', 'music-note', 'movie'
];

const IconPicker = ({ visible, onSelect, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <FlatList
            data={icons}
            numColumns={5}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.iconItem}
                onPress={() => onSelect(item)}
              >
                <MaterialIcons name={item} size={30} color="#333" />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
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
    maxHeight: '60%',
  },
  iconItem: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconPicker;