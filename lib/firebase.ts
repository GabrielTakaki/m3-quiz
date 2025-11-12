import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
    apiKey: "AIzaSyDo59tEzfzBpqqDtm9WM7Eq993DY9OAF74",
    authDomain: "quiz-app-69215.firebaseapp.com",
    projectId: "quiz-app-69215",
    storageBucket: "quiz-app-69215.firebasestorage.app",
    messagingSenderId: "234107421151",
    appId: "1:234107421151:web:8c626e018a42e030c5446a",
    measurementId: "G-CKNK3HEX29"
};

const existingApps = getApps();
const app = existingApps.length ? getApp() : initializeApp(firebaseConfig);

export const firebaseApp = app;
export const auth =
  Platform.OS === 'web' || existingApps.length
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
export const db = getFirestore(app);
