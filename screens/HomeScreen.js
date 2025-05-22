import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDirectory } from '../context/DirectoryContext';
import DirectoryItem from '../components/DirectoryItem';
import MessageItem from '../components/MessageItem';
import CreateDirectoryModal from '../components/CreateDirectoryModal';

const HomeScreen = ({ navigation }) => {
  const { directories, selectedDirectory, setSelectedDirectory, addDirectory } = useDirectory();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleSelectDirectory = (dir) => {
    setSelectedDirectory(dir);
  };

  return (
    <View style={styles.container}>
      {/* Left Sidebar */}
      <View style={styles.sidebar}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>My Notes</Text>
          <TouchableOpacity
            style={styles.newFolderButton}
            onPress={() => setShowCreateModal(true)}
          >
            <MaterialIcons name="create-new-folder" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <DirectoryItem
          dir={directories[0]}
          depth={0}
          onSelect={handleSelectDirectory}
        />
      </View>

      {/* Main Chat Area */}
      <ImageBackground 
        source={selectedDirectory?.bgImageUri ? { uri: selectedDirectory.bgImageUri } : null}
        style={styles.main}
        imageStyle={{ 
          opacity: 0.15,
          resizeMode: 'cover'
        }}
       >
        {selectedDirectory ? (
            <>
              <View style={styles.chatHeader}>
                <Text style={styles.chatTitle}>{selectedDirectory.name}</Text>
              </View>

              {selectedDirectory?.children?.length === 0 && (
                <View style={styles.emptyFolder}>
                  <Text>No subfolders - add new using + button</Text>
                </View>
              )}
            
            <FlatList
              data={selectedDirectory.messages}
              contentContainerStyle={styles.chatContent}
              renderItem={({ item }) => (
                <MessageItem
                  message={item}
                  directoryId={selectedDirectory.id}
                />
              )}
              keyExtractor={item => item.id}
              inverted
            />

            <TouchableOpacity
              style={styles.newNoteButton}
              onPress={() => navigation.navigate('CreateNote', {
                directoryId: selectedDirectory.id
              })}
            >
              <MaterialIcons name="add" size={28} color="#fff" />
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="forum" size={48} color="#ddd" />
            <Text style={styles.emptyText}>Select a folder to view notes</Text>
          </View>
        )}
      </ImageBackground>

      <CreateDirectoryModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={(name, icon, chatBgColor, bgImageUri) => {
          // Always add to root parent
          addDirectory('root', name, 'folder', icon, chatBgColor, bgImageUri);
          setShowCreateModal(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  emptyFolder: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sidebar: {
    width: 280,
    backgroundColor: '#f5f5f5',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#075e54',
  },
  sidebarTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  newFolderButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#128C7E',
  },
  main: {
    flex: 1,
    backgroundColor: '#ece5dd',
  },
  chatHeader: {
    padding: 16,
    backgroundColor: '#075e54',
  },
  chatTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatContent: {
    padding: 16,
  },
  newNoteButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#25D366',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
});

export default HomeScreen;