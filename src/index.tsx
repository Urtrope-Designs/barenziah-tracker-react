import ReactDOM from 'react-dom';
import BtrApp from './BtrApp';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

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

if (Capacitor.isNativePlatform()) {
  StatusBar.hide()
     .catch(console.log);
  SplashScreen.hide();
}

ReactDOM.render(<BtrApp />, document.getElementById('btr_app'));
