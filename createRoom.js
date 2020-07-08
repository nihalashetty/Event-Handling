var loggedInEmail = '';
var firebaseConfig = {
  apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  databaseURL: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  projectId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  storageBucket: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  messagingSenderId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  appId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  measurementId: "xxxxxxxxxxxxxxxxxxxxxxxx"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference messages collection
var messagesRef = firebase.database().ref('roomDetails');

// Listen for form submit
document.getElementById('createRoom').addEventListener('submit', submitForm);
$('#googleSignin').click(() => {
  googleSignin();
});

$(document).ready(function() {
  getLoggedInUserData();
});

function loggedInUser() {
  var user = firebase.auth().currentUser;
  if (user) {
    console.log(user);
  } else {
    console.log('Not Signed in');
  }
}
function deletePreviousRoom() {
  let userRef = firebase.database().ref('roomDetails');
  userRef.remove()
}

// Submit form
function submitForm(e){
  e.preventDefault();
  deletePreviousRoom();
  var map = getInputVal('map');
  var type = getInputVal('type');
  var pType = getInputVal('pType');
  var date = getInputVal('date');
  var time = getInputVal('time');

  if (loggedInEmail === 'YOUR GMAIL ID') {
    saveMessage(map, type, pType, date, time);
    document.querySelector('.alertSuccess').style.display = 'block';

    setTimeout(function() {
      document.querySelector('.alertSuccess').style.display = 'none';
    },3000);

    document.getElementById('createRoom').reset();
    $('.yt-username').click();
    $('.yt-thumb-clip').click();
  } else {
    document.querySelector('.alertFailure').style.display = 'block';
    setTimeout(function() {
      document.querySelector('.alertFailure').style.display = 'none';
    },3000);
  }
}

// Function to get get form values
function getInputVal(id){
  return document.getElementById(id).value;
}

// Save message to firebase
function saveMessage(map, type, pType, date, time){
  var newMessageRef = messagesRef.push();
  newMessageRef.set({
    map: map,
    type: type,
    pType: pType,
    date: date,
    time: time
  });
}

var provider = new firebase.auth.GoogleAuthProvider();
function googleSignin() {
  firebase.auth().signInWithRedirect(provider);
}

function getLoggedInUserData() {
  firebase.auth().getRedirectResult().then(function(result) {
    var user = result.user;
    loggedInEmail = user.email;
    loggedInUser();
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
  });
}

function googleSignout() {
  firebase.auth().signOut()
  .then(function() {
    loggedInEmail = '';
    console.log('Signout Succesfull')
  }, function(error) {
    console.log('Signout Failed')  
  });
}