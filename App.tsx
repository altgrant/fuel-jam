import React from 'react';
import { View, Text } from 'react-native';
import { FuelJamScreen } from './screens/FuelJamScreen';

console.log('App.tsx loading...');

const App: React.FC = () => {
  console.log('App component rendering...');
  
  try {
    console.log('Rendering FuelJamScreen...');
    return <FuelJamScreen shouldReward={true} />;
  } catch (error) {
    const err = error as Error;
    console.error('Error rendering FuelJamScreen:', err);
    console.error('Stack trace:', err.stack);
    
    // Fallback to error message
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#f0f0f0',
        padding: 20
      }}>
        <Text style={{ 
          fontSize: 24, 
          fontWeight: 'bold', 
          color: '#FF0000',
          marginBottom: 10
        }}>
          Error Loading Game
        </Text>
        <Text style={{ 
          fontSize: 16, 
          color: '#666',
          textAlign: 'center'
        }}>
          {err.message}
        </Text>
      </View>
    );
  }
};

export default App; 