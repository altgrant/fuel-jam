import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRegistry } from 'react-native';
import App from './App';

// Add global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  const loading = document.getElementById('loading');
  if (loading) {
    loading.innerHTML = `Error: ${event.error.message}`;
    loading.style.color = 'red';
  }
});

console.log('index.web.js loading...');

try {
  console.log('Testing React Native Web imports...');
  console.log('AppRegistry:', AppRegistry);
  console.log('App component:', App);
  
  // Register the app with AppRegistry
  console.log('Registering app...');
  AppRegistry.registerComponent('FuelJam', () => App);
  console.log('App registered with AppRegistry');
  
  const rootElement = document.getElementById('root');
  console.log('Root element found:', !!rootElement);
  
  if (rootElement) {
    console.log('Running app via AppRegistry...');
    
    // Use AppRegistry.runApplication instead of getApplication
    AppRegistry.runApplication('FuelJam', {
      rootTag: rootElement,
      initialProps: {}
    });
    
    console.log('App rendered successfully via AppRegistry');
    
    // Hide loading indicator after successful render
    setTimeout(() => {
      const loading = document.getElementById('loading');
      if (loading) {
        console.log('Hiding loading indicator');
        loading.style.display = 'none';
      }
    }, 1000);
  } else {
    console.error('Root element not found!');
  }
} catch (error) {
  console.error('Error in index.web.js:', error);
  console.error('Stack trace:', error.stack);
  
  // Show error on screen
  const loading = document.getElementById('loading');
  if (loading) {
    loading.innerHTML = `Error: ${error.message}`;
    loading.style.color = 'red';
  }
} 