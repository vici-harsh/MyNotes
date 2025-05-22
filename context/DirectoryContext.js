// DirectoryContext.js
import React, { createContext, useState, useContext } from 'react';

const DirectoryContext = createContext();

export const DirectoryProvider = ({ children }) => {
  const [directories, setDirectories] = useState([
    {
      id: 'root',
      name: 'My Notes',
      icon: 'folder',
      bgColor: '#ffffff',
      chatBgColor: '#DCF8C6',
      children: [],
      messages: [],
      parent: null,
      isExpanded: true,
    },
  ]);
  const [selectedDirectory, setSelectedDirectory] = useState(null);
  
  const findDirectory = (dirs, id) => {
    for (const dir of dirs) {
      if (dir.id === id) return dir;
      if (dir.children.length > 0) {
        const found = findDirectory(dir.children, id);
        if (found) return found;
      }
    }
    return null;
  };

const generateUniqueId = () => '_' + Math.random().toString(36).substr(2, 9);

const randomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};


const addDirectory = (parentId, name, type = 'folder', icon = 'folder', chatBgColor = '#DCF8C6', bgImageUri = null) => {
const newDir = {
  id: generateUniqueId(),
  name,
  type,
  parent: parentId,
  icon,
  chatBgColor,
  bgImageUri,
  children: [],
  bgColor: randomColor(),
  messages: [],
  isExpanded: true,
};

  setDirectories(prevDirs => {
    const updatedDirs = JSON.parse(JSON.stringify(prevDirs));

    const addToParent = (nodes) => {
      for (let node of nodes) {
        if (node.id === parentId) {
          if (!node.children) node.children = [];
          node.children.push(newDir);
          return true;
        }
        if (node.children && addToParent(node.children)) return true;
      }
      return false;
    };

    if (parentId === 'root') {
      updatedDirs.push(newDir);
    } else {
      addToParent(updatedDirs);
    }

    return updatedDirs;
  });
};


  const generateRandomLightColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 80%, 90%)`;
  };

  const deleteDirectory = (dirId) => {
    setDirectories(prevDirs => {
      const recursiveDelete = (dirs) => 
        dirs.filter(dir => dir.id !== dirId)
            .map(dir => ({
              ...dir,
              children: recursiveDelete(dir.children)
            }));
      
      const updatedDirs = recursiveDelete(prevDirs);
      
      // Clear selection if deleted directory was selected
      if (selectedDirectory?.id === dirId) {
        setSelectedDirectory(null);
      }
      
      return updatedDirs;
    });
  };

  const addMessage = (dirId, text, imageUris = [], fileUris = []) => {
    setDirectories(prev => {
      const updateDir = dir => {
        if (dir.id === dirId) {
          return {
            ...dir,
            messages: [
              ...dir.messages,
              {
                id: Date.now().toString(),
                text,
                imageUris,
                fileUris,
                bgColor: dir.chatBgColor || '#DCF8C6',
                createdAt: new Date(),
              },
            ],
          };
        }
        return {
          ...dir,
          children: dir.children.map(updateDir),
        };
      };
      return prev.map(updateDir);
    });
  };

const deleteMessage = (dirId, messageId) => {
  setDirectories(prevDirs => {
    const updateDir = dir => {
      if (dir.id === dirId) {
        return {
          ...dir,
          messages: dir.messages.filter(msg => msg.id !== messageId)
        };
      }
      return {
        ...dir,
        children: dir.children.map(updateDir)
      };
    };
    return prevDirs.map(updateDir);
  });
};

  const updateMessage = (dirId, messageId, updates) => {
    setDirectories(prev => {
      const updateDir = dir => {
        if (dir.id === dirId) {
          return {
            ...dir,
            messages: dir.messages.map(msg => 
              msg.id === messageId ? { ...msg, ...updates } : msg
            ),
          };
        }
        return {
          ...dir,
          children: dir.children.map(updateDir),
        };
      };
      return prev.map(updateDir);
    });
  };

  return (
    <DirectoryContext.Provider
      value={{
        directories,
        selectedDirectory,
        setSelectedDirectory,
        addDirectory,
        deleteDirectory,
        addMessage,
        deleteMessage,
        updateMessage,
      }}
    >
      {children}
    </DirectoryContext.Provider>
  );
};

export const useDirectory = () => useContext(DirectoryContext);