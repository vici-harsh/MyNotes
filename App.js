import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DirectoryProvider } from './context/DirectoryContext';
import HomeScreen from './screens/HomeScreen';
import CreateNoteScreen from './screens/CreateNoteScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <DirectoryProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'My Notes' }}
          />
          <Stack.Screen 
            name="CreateNote" 
            component={CreateNoteScreen} 
            options={{ title: 'New Note' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </DirectoryProvider>
  );
}