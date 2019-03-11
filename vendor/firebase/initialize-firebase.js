// Initialize Firebase
var config = {
  apiKey: "AIzaSyBnUYT3fwHB6ZDEXqqcm04iz93U7T2OJuM",
  authDomain: "homecarecontrol-5f45f.firebaseapp.com",
  databaseURL: "https://homecarecontrol-5f45f.firebaseio.com",
  projectId: "homecarecontrol-5f45f",
  storageBucket: "homecarecontrol-5f45f.appspot.com",
  messagingSenderId: "1027440555829"
};
firebase.initializeApp(config);

function eventoScroll() {
  if (window.scrollY == 0) {
    $('#btnScrollTop').css('display', 'none');
  } else {
    $('#btnScrollTop').css('display', '');
  }
};
