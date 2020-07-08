  var loggedInEmail = '';
  var RegisteredUsers = [];
  var RegisteredUsersKey = [];
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
  var messagesRef = firebase.database().ref('SquadDetails');
  var formRef = firebase.database().ref('SquadDetails');
  var matchIndoRef = firebase.database().ref('roomDetails');

  // Listen for form submit
  document.getElementById('contactForm').addEventListener('submit', submitForm);
  $('#googleSignin').click((e) => {
    googleSignin();
  });

  $(document).on("click", ".delete" , function(e) {
    deteteUser(e);
  });

  $(document).ready(function() {
    retriveMatchInfo();
    getLoggedInUserData();
    retriverForm();
  });

  function loggedInUser() {
    var user = firebase.auth().currentUser;
    if (user) {
      console.log(user);
    } else {
      console.log('Not Signed in');
    }
  }
  function deteteUser(e) {
    let userSelected = $(e.currentTarget).data('name');
    RegisteredUsersKey[RegisteredUsers.indexOf(userSelected)];
    let userRef = firebase.database().ref('SquadDetails/' + RegisteredUsersKey[RegisteredUsers.indexOf(userSelected)]);
    userRef.remove()
  }

  // Submit form
  function submitForm(e){
    e.preventDefault();

    var name = getInputVal('name');
    var igl = getInputVal('igl');
    var email = loggedInEmail;
    var phone = getInputVal('phone');

    if (email === '' || email === undefined) {
      document.querySelector('.alertFailure').style.display = 'block';
  
      setTimeout(function() {
        document.querySelector('.alertFailure').style.display = 'none';
      },3000);
    } else if (RegisteredUsers.indexOf(email) > -1) {
      document.querySelector('.alertAlreadyRegistered').style.display = 'block';
  
      setTimeout(function() {
        document.querySelector('.alertAlreadyRegistered').style.display = 'none';
      },3000);
    } else {
      saveMessage(name, igl, email, phone);
      document.querySelector('.alertSuccess').style.display = 'block';

      setTimeout(function() {
        document.querySelector('.alertSuccess').style.display = 'none';
      },3000);

      document.getElementById('contactForm').reset();
      $('.yt-username').click();
      $('.yt-thumb-clip').click()
    }
  }

  // Function to get get form values
  function getInputVal(id){
    return document.getElementById(id).value;
  }

  function retriveMatchInfo () {
    matchIndoRef.on("value", function(snapshot) {
      $('#matchInfo-append').empty();
      for (let [key, value] of Object.entries(snapshot.val())) {
        let dataAppend = `<p>
                            <label>MAP</label>
                            <input type="text" name="map" value='${value.map}' id="map" readonly>
                          </p>
                          <p>
                            <label>TYPE</label>
                            <input type="text" name="type" value='${value.type}' id="type" readonly>
                          </p>
                          <p>
                            <label>PLAYER TYPE</label>
                            <input type="text" name="pType" value='${value.pType}' id="pType" readonly>
                          </p>
                          <p>
                            <label>DATE</label>
                            <input type="text" name="date" value='${value.date}' id="date" readonly>
                          </p>
                          <p>
                            <label>TIME</label>
                            <input type="text" name="time" value='${value.time}' id="time" readonly>
                          </p>`;
        $('#matchInfo-append').append(dataAppend);
        if (loggedInEmail === 'YOUR GMAIL ID') {
          let editButton = `<a class='edit' href='../createRoom.html' >EDIT</a>`;
          $('#matchInfo-append').append(editButton);
        }
  
      }
    }, function (error) {
      console.log("Error: " + error.code);
    });
  }

  function retriverForm () {
    formRef.on("value", function(snapshot) {
      let index = 2;
      $('#registeredSquad').empty();
      $('.deleteHeader').remove();
      if (loggedInEmail === 'YOUR GMAIL ID') {
        $('.thead-light tr').append('<th class="deleteHeader" scope="col">DELETE</th>');
      }

      for (let [key, value] of Object.entries(snapshot.val())) {
        var addDeleteButton = '';
        let isPlaying = index < 19 ? 'green' : 'red';
        RegisteredUsers.push(value.email);
        RegisteredUsersKey.push(key);
        if (loggedInEmail === 'YOUR GMAIL ID') {
          addDeleteButton = `<td><button class='delete' data-name='${value.email}'>Delete</button></td>`;
        }
        let tableData = `<tr class='${isPlaying}'><th scope="row">${index}</th><td>${value.name}</td><td>${value.igl}</td>${addDeleteButton}</tr>`;
        $('#registeredSquad').append(tableData);
        index++;
      }
    }, function (error) {
      console.log("Error: " + error.code);
    });
  }

  // Save message to firebase
  function saveMessage(name, igl, email, phone){
    var newMessageRef = messagesRef.push();
    newMessageRef.set({
      name: name,
      igl:igl,
      email:email,
      phone:phone
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