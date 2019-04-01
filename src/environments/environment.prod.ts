/* fixed "Firebase does not exist" error with https://stackoverflow.com/questions/44033079/property-firebase-does-not-exist-on-type-production-boolean */

export const environment = {
  production: true,
  firebase: {
    apiKey: "AIzaSyBV-_u43rEgso6UEz0KwYu1SmGXzvLDpUM",
    authDomain: "testdatabase-323a7.firebaseapp.com",
    databaseURL: "https://testdatabase-323a7.firebaseio.com",
    projectId: "testdatabase-323a7",
    storageBucket: "testdatabase-323a7.appspot.com",
    messagingSenderId: "597444339587"
  }
};
