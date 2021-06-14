import React from 'react';
import ReactDOM from 'react-dom';
import BtrApp from './BtrApp';

// // Use matchMedia to check the user preference
// const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// toggleDarkTheme(prefersDark.matches);

// // Listen for changes to the prefers-color-scheme media query
// prefersDark.addListener((mediaQuery) => toggleDarkTheme(mediaQuery.matches));

toggleDarkTheme(true);

// Add or remove the "dark" class based on if the media query matches
function toggleDarkTheme(shouldAdd: boolean) {
  document.body.classList.toggle('dark', shouldAdd);
}

ReactDOM.render(<BtrApp />, document.getElementById('btr_app'));
