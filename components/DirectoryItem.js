import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDirectory } from '../context/DirectoryContext';

const DirectoryItem = ({ dir, depth, onSelect }) => {
  const [expanded, setExpanded] = useState(dir.isExpanded);
  const [showOptions, setShowOptions] = useState(false);
  const { addDirectory, deleteDirectory, selectedDirectory } = useDirectory();
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    setExpanded(!expanded);
    onSelect(dir);
  };

  const handleAddParallelFolder = () => {
    const newFolderName = `Folder ${Math.floor(Math.random() * 100)}`;
    addDirectory(dir.parent || 'root', newFolderName, 'folder', 'folder', '#DCF8C6', null);
    setShowOptions(false);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Folder",
      `Delete "${dir.name}" and all its contents?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: () => deleteDirectory(dir.id),
          style: "destructive"
        }
      ]
    );
    setShowOptions(false);
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg']
  });

  Animated.timing(rotateAnim, {
    toValue: expanded ? 1 : 0,
    duration: 200,
    useNativeDriver: true,
  }).start();

  return (
    <View style={[styles.container, { marginLeft: depth * 15 }]}>
      <View style={styles.row}>
        <TouchableOpacity 
          onPress={toggleExpand} 
          onLongPress={() => setShowOptions(true)}
          style={[
            styles.dirButton, 
            { 
              backgroundColor: dir.bgColor || '#f5f5f5',
              borderWidth: selectedDirectory?.id === dir.id ? 2 : 0,
              borderColor: '#128C7E',
            }
          ]}
          activeOpacity={0.7}
        >
          <MaterialIcons 
            name={dir.icon || 'folder'} 
            size={20} 
            style={styles.icon} 
            color={getContrastColor(dir.bgColor || '#f5f5f5')}
          />
          <Text style={[styles.name, { color: getContrastColor(dir.bgColor || '#f5f5f5') }]}>
            {dir.name}
          </Text>
          {dir.children.length > 0 && (
            <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={20}
                color={getContrastColor(dir.bgColor || '#f5f5f5')}
              />
            </Animated.View>
          )}
        </TouchableOpacity>

        {showOptions && (
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={styles.optionButton}
              onPress={handleAddParallelFolder}
            >
              <MaterialIcons name="create-new-folder" size={18} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.optionButton}
              onPress={handleDelete}
            >
              <MaterialIcons name="delete" size={18} color="#ff4444" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {expanded && dir.children.map(child => (
        <DirectoryItem
          key={child.id}
          dir={child}
          depth={depth + 1}
          onSelect={onSelect}
        />
      ))}
    </View>
  );
};

const getContrastColor = (hexColor) => {
  if (!hexColor) return '#333';
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#333' : '#fff';
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
  },
  dirButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  icon: {
    marginRight: 8,
  },
  name: {
    flex: 1,
    fontSize: 16,
  },
});

export default DirectoryItem;