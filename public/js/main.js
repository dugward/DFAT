//IMPORTS
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-analytics.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

// FIREBASE STARTUP

const firebaseConfig = {
  apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "newfat-d9a68.firebaseapp.com",
  projectId: "newfat-d9a68",
  storageBucket: "newfat-d9a68.appspot.com",
  messagingSenderId: "354205618456",
  appId: "1:354205618456:web:6b5304e39b193fd3c40e6d",
  measurementId: "G-DY1HWTJJH7",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const lists = collection(db, "lists");

//THE LIST OF LISTS!

var listoflists = [];

// BUTTONS, MENUS

// domgrabbers

const menuButton = document.querySelector(".menuIcons");
const loginButton = document.querySelector(".loginButton");
const nonDugward = document.querySelector(".nonDugward");
const dugwardButton = document.querySelector(".dugwardButton");
const adminMain = document.querySelector(".adminMain");
const listSearchResult = document.querySelector(".listSearchResult");
const listEntry = document.querySelector(".listEntry");
const popup = document.querySelector(".popup");
const leadersInner = document.querySelector(".leadersInner");
const usersInner = document.querySelector(".users-inner");
const spinnerMain = document.querySelector(".spinner.main");
const spinnerPopup = document.querySelector(".spinner.popupspin");
const spinnerTop = document.querySelector(".spinner.topspin");
const wrapper = document.querySelector(".wrapper");
var userCompare;

// important constants
var w = document.documentElement.clientWidth || window.innerWidth;
//a constant that is the current year, or, if the current month is Jan-June, the previous year
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const oscarYear = currentMonth < 6 ? currentYear - 1 : currentYear;

// the hamburgler

function closeMenu() {
  menuButton.getElementsByClassName("close")[0].style.display = "none";
  menuButton.getElementsByClassName("burger")[0].style.display = "block";

  for (let navItem of document.getElementsByClassName("navItem")) {
    navItem.style.display = "none";
  }
}

menuButton.addEventListener("click", function (e) {
  if (e.target.id == "closemenu") {
    closeMenu();
  } else {
    if (user.uid) {
      menuButton.querySelectorAll(".close")[0].style.display = "block";
      menuButton.getElementsByClassName("burger")[0].style.display = "none";

      for (let navItem of document.getElementsByClassName("navItem")) {
        if (!navItem.classList.contains("dugwardButton")) {
          navItem.style.display = "block";
        }
        if (userDoc.admin == true) {
          document.querySelector(".dugwardButton").style.display = "block";
        }
      }
    }
  }
});

window.onresize = () => {
  var w = document.documentElement.clientWidth || window.innerWidth;
  if (w > 700) {
    for (let navItem of document.getElementsByClassName("navItem")) {
      navItem.style.display = "block";
    }
  } else {
    closeMenu();
  }
};

//add event listener to #title to show .nonDugward when clicked and hide .adminMain and .listSearchResult and .listEntry and close list drawer
document.querySelector("#title").addEventListener("click", () => {
  if (user) {
    nonDugward.style.display = "block";
    adminMain.style.display = "none";
    listSearchResult.style.display = "none";
    listEntry.style.display = "none";
    popup.style.display = "none";
    document.querySelector(".listsDrawer").style.display = "none";
    document.querySelector(".five-warning").style.display = "none";
  }
});

// the list drawer opening & closing

document.querySelector(".drawerclose").addEventListener("click", function (e) {
  e.currentTarget.parentNode.style.display = "none";
  document.querySelector(".listsButton").classList.add("closed");
});

document
  .querySelector(".drawerMoreButton")
  .addEventListener("click", function (e) {
    e.currentTarget.nextSibling.nextSibling.style.display = "block";
    e.currentTarget.style.display = "none";
  });

//list drawer open function

function listDrawerOpen() {
  document.querySelector(".listsDrawer").style.display = "block";
  document.querySelector(".drawerMore").style.display = "none";

  var newhtml = "";
  var newmorehtml = "";
  //for statement for each list in db who has display value of true
  //for each of allLists
  for (const list in allLists) {
    const doc = allLists[list];
    //if the doc has display true
    if (doc.display == true) {
      //if the doc has more false and is not in the listoflists array
      if (doc.more == false && !listoflists.includes(doc.name)) {
        newhtml += `<span class="listButton ">${doc.name}</span>`;
      }
      //if the doc has more false and is in the listoflists array
      if (doc.more == false && listoflists.includes(doc.name)) {
        newhtml += `<span class="listButton listclicked">${doc.name}</span>`;
      }
      //if the doc has more true and is not in the listoflists array
      if (doc.more == true && !listoflists.includes(doc.name)) {
        newmorehtml += `<span class="listButton more">${doc.name}</span>`;
      }
      //if the doc has more true and is in the listoflists array
      if (doc.more == true && listoflists.includes(doc.name)) {
        newmorehtml += `<span class="listButton more listclicked">${doc.name}</span>`;
      }
    }
  }

  //put up html

  document.querySelector(".listsnotmore").innerHTML = newhtml;
  document.querySelector(".drawerMore").innerHTML = newmorehtml;
  //if any of the docs had more=true
  if (newmorehtml != "") {
    document.querySelector(".drawerMoreButton").style.display = "block";
  }
  for (let listButton of document.getElementsByClassName("listButton")) {
    listButton.addEventListener("click", function (e) {
      if (e.currentTarget.classList.contains("listclicked")) {
        e.currentTarget.classList.remove("listclicked");
        listoflists.splice(listoflists.indexOf(e.currentTarget.innerHTML), 1);
        console.log(listoflists);
      } else {
        e.currentTarget.classList.add("listclicked");
        listoflists.push(e.currentTarget.innerHTML);
        console.log(listoflists);
      }

      //if popup is displayed
      if (popup.style.display == "block") {
        //if leadersInner is displayed
        if (leadersInner.style.display == "block") {
          putEmUpLeaders();
        }
        //if user-compare div is shown
        if (usersInner.querySelector(".user-compare")) {
          whenUserClicked();
        }
      } else {
        putEmUpMain();
      }
    });
  }

  // the all lists button
  document
    .querySelector(".listsnotmore")
    .insertAdjacentHTML(
      "beforeend",
      `<span class="listButton all-lists-button"> All ${oscarYear} Lists</span>`
    );
  document
    .querySelector(".listsnotmore")
    .lastChild.addEventListener("click", function (e) {
      if (e.currentTarget.classList.contains("listclicked")) {
        //remove all displayed lists from listoflists if more!=true
        e.currentTarget.classList.remove("listclicked");
        for (let listButton of document.getElementsByClassName("listButton")) {
          if (
            !listButton.classList.contains("all-lists-button") &&
            !listButton.classList.contains("more")
          ) {
            listButton.classList.remove("listclicked");
            listoflists.splice(listoflists.indexOf(listButton.innerHTML), 1);
          }
          console.log(listoflists);
        }
      } else {
        e.currentTarget.classList.add("listclicked");
        //add all displayed lists to listoflists if more!=true
        for (let listButton of document.getElementsByClassName("listButton")) {
          if (
            !listButton.classList.contains("all-lists-button") &&
            !listoflists.includes(listButton.innerHTML) &&
            !listButton.classList.contains("more") &&
            listButton.textContent != `Your ${oscarYear} Top 5`
          ) {
            listButton.classList.add("listclicked");
            listoflists.push(listButton.innerHTML);
          }
          console.log(listoflists);
        }
      }
      putEmUpMain();
    });

  //end allists button

  if (w <= 700) {
    closeMenu();
  }
}
//lists button opening & closing
document.querySelector(".listsButton").addEventListener("click", () => {
  //if listsbutton has class closed, open the drawer
  if (document.querySelector(".listsButton").classList.contains("closed")) {
    document.querySelector(".five-warning").style.display = "none";
    listDrawerOpen();
    document.querySelector(".listsButton").classList.remove("closed");
  } else {
    //add class closed to listsbutton and close the drawer
    document.querySelector(".listsDrawer").style.display = "none";
    document.querySelector(".listsButton").classList.add("closed");
    if (w <= 700) {
      closeMenu();
    }
  }
});

//put up the leaders function
async function putEmUpLeaders() {
  await grabSelectedFilms();

  var leaderlistHtmlArray = [];
  //empty the leadersInner
  leadersInner.innerHTML = "";
  leadersInner.insertAdjacentHTML("afterbegin", `Progress in chosen lists.`);
  //  for each user in the allUsers object
  for (let user in allUsers) {
    //constant that is the intersection of their movie list in the object and the allFilms array

    //constant called intersection that includes all films shared between allUsers[user] and allFilms
    const userListNumbers = allUsers[user].moviesSeen.map(Number);
    // console.log(userListNumbers);
    let intersection = userListNumbers.filter((x) => allFilms.includes(x));
    // console.log(intersection);

    let newName = user.match(/.*\s./g);
    //make a constant that is the percentage of films the user has seen out of the movies currently displayed
    const percentage = Math.round(
      (intersection.length / allFilms.length) * 100
    );

    leaderlistHtmlArray.push(
      `<div class=" ${percentage} leaderRow"><span class="leaderName" id="${user}"><span class="leaderNameLink" id="${user}">${newName[0]}.</span> ···················································
      </span><div class="progressbar"><div class="progress" style="width:${percentage}%"><span class="ratio ">${intersection.length}/${allFilms.length}</span></div></div></div>`
    );
  }
  //sort the leaderlistHtmlArray by the percentage
  leaderlistHtmlArray.sort().reverse();
  //put up the html
  leadersInner.insertAdjacentHTML("beforeend", leaderlistHtmlArray.join(""));
  //add event listeners to the leaderNames
  for (let leaderName of document.getElementsByClassName("leaderNameLink")) {
    leaderName.addEventListener("click", function (e) {
      leadersInner.innerHTML = "";
      document.querySelector(".leadersButton").classList.add("closed");
      usersInner.style.display = "block";
      document.querySelector(".usersButton").classList.remove("closed");
      whenUserClicked(e);
    });
  }
}

// the leaders opening & closing

document
  .querySelector(".leadersButton")
  .addEventListener("click", async function (e) {
    //if leadersbutton has class closed
    if (document.querySelector(".leadersButton").classList.contains("closed")) {
      document.querySelector(".five-warning").style.display = "none";
      popup.style.display = "block";

      document.querySelector("main-grid").style.display = "none";
      leadersInner.style.display = "block";
      usersInner.style.display = "none";
      document.querySelector(".usersButton").classList.add("closed");
      await putEmUpLeaders();
      document.querySelector(".progressbar.main").style.display = "none";
      //remove class closed from leadersbutton
      document.querySelector(".leadersButton").classList.remove("closed");
      if (w <= 700) {
        closeMenu();
      }
    } else {
      popupClose();
      if (w <= 700) {
        closeMenu();
      }
    }
  });

//

// put up users function

const putUpUserNames = () => {
  //empty the usersInner
  usersInner.innerHTML = "";
  var newUsersInnerHtml = [];
  //for each user in the allUsers object
  for (let user in allUsers) {
    //if the user is not the current user
    if (user != userName) {
      newUsersInnerHtml.push(
        `<span class="user-name-link" id="${user}">${user}</span>`
      );
    }
  }
  newUsersInnerHtml.sort();
  usersInner.insertAdjacentHTML(
    "afterbegin",
    `<div class="user-names"> ${newUsersInnerHtml.join("")} </div>`
  );
  //add event listeners to names
  for (let thisUserName of document.getElementsByClassName("user-name-link")) {
    thisUserName.addEventListener("click", whenUserClicked);
  }
};

// when user clicked function

const whenUserClicked = async (e) => {
  console.log(clickedUserName);
  spinnerPopup.style.display = "block";
  //if there is an e
  if (e) {
    clickedUserName = e.currentTarget.id;
    console.log(clickedUserName);
  }
  var themCount = 0;
  var youCount = 0;
  //empty the usersInner
  usersInner.innerHTML = "";
  var newUserInnerHtml = "";
  // <div class="user-compare"></div>
  newUserInnerHtml += `<div class="user-compare-row first">
              <div class="user-compare-film"></div>
              <div class="user-compare-one"><span class="user-compare-count-one"></span><span class="user-compare-name">${
                clickedUserName.match(/.*\s./g)[0]
              }</span></div>
            
            <div class="user-compare-two"><span class="user-compare-count-two"></span><span class="user-compare-name">${
              userName.match(/.*\s./g)[0]
            }</span></div></div>`;
  await grabSelectedFilms();
  // console.log(`clicked user: ${allUsers[clickedUserName]}`);
  // console.log(`you user: ${allUsers[userName]}`);
  // console.log(allFilms);
  //for each film in the allFilms array
  //sort allFilms by title
  await allFilms.sort((a, b) =>
    allMovies[a].title.localeCompare(allMovies[b].title, undefined, {
      sensitivity: "base",
    })
  );

  //
  console.log(allFilms);
  //if there are movies in the allUsers[clickedUserName].topFive array
  if (allUsers[clickedUserName].topFive.length > 0) {
    console.log(allUsers[clickedUserName].topFive);
    //move the clicked user's top five at the beginning of allFilms
    for (let movie of allUsers[clickedUserName].topFive) {
      //if allFilms includes the movie
      if (allFilms.includes(parseInt(movie))) {
        allFilms.splice(allFilms.indexOf(parseInt(movie)), 1);
        allFilms.unshift(parseInt(movie));
      }
    }
    console.log(allFilms);
  }
  for (let film of allFilms) {
    const movie = allMovies[film];

    newUserInnerHtml += `<div class="user-compare-row">
                        <div class="user-compare-film"><a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank">${movie.title}</a></div>`;
    //if the userName user has the film in their list in the allUsers object
    if (allUsers[clickedUserName].moviesSeen.includes(`${movie.id}`)) {
      //if the movie is in the clickedUserName user's top five
      if (allUsers[clickedUserName].topFive.includes(`${movie.id}`)) {
        newUserInnerHtml += `<div class="user-compare-one"><div class="green-box"></div></div>`;
        themCount++;
      } else {
        newUserInnerHtml += `<div class="user-compare-one"><div class="pink-box"></div></div>`;
        themCount++;
      }
    } else {
      newUserInnerHtml += `<div class="user-compare-one">&nbsp;</div>`;
    }
    if (allUsers[userName].moviesSeen.includes(`${movie.id}`)) {
      newUserInnerHtml += `<div class="user-compare-two"><div class="pink-box"></div></div></div>`;
      youCount++;
    } else {
      newUserInnerHtml += `<div class="user-compare-two">&nbsp;</div></div>`;
    }
  }
  usersInner.innerHTML = `<div class="user-compare">${newUserInnerHtml}</div>`;
  userCompare = document.querySelector(".user-compare");

  //put counts into the spans user-compare-count-one and user-compare-count-two
  document.querySelector(".user-compare-count-one").innerHTML = `${themCount}`;
  document.querySelector(".user-compare-count-two").innerHTML = `${youCount}`;
  spinnerPopup.style.display = "none";
};

// the users opening & closing

document
  .querySelector(".usersButton")
  .addEventListener("click", async function (e) {
    //if usersbutton has class closed
    if (document.querySelector(".usersButton").classList.contains("closed")) {
      document.querySelector(".five-warning").style.display = "none";
      popup.style.display = "block";

      document.querySelector("main-grid").style.display = "none";
      usersInner.style.display = "block";
      leadersInner.style.display = "none";
      await putUpUserNames();
      document.querySelector(".progressbar.main").style.display = "none";
      document.querySelector(".leadersButton").classList.add("closed");
      //remove class closed from leadersbutton
      document.querySelector(".usersButton").classList.remove("closed");
      if (w <= 700) {
        closeMenu();
      }
    } else {
      popupClose();
      if (w <= 700) {
        closeMenu();
      }
    }
  });

function popupClose() {
  popup.style.display = "none";
  document.querySelector(".progressbar.main").style.display = "block";
  document.querySelector("main-grid").style.display = "flex";
  leadersInner.style.display = "none";
  usersInner.style.display = "none";
  document.querySelector(".usersButton").classList.add("closed");
  document.querySelector(".leadersButton").classList.add("closed");
  putEmUpMain();
}

document.querySelector(".popupclose").addEventListener("click", popupClose);

//  open up main admin

const openAdmin = async () => {
  document.querySelector(".five-warning").style.display = "none";
  nonDugward.style.display = "none";
  adminMain.style.display = "block";
  document.querySelector(".adminMainLists").innerHTML = "";
  if (w <= 700) {
    closeMenu();
  }
  var displayhtml = ``;
  //adding lists to  display html string
  for (const listy in allLists) {
    const list = allLists[listy];
    // console.log(list);
    displayhtml += `<div id="${list.name}" class="listCheck ${list.name}">`;
    //if the list display=true, then add a checked checkbox
    if (list.display == true) {
      displayhtml += `<input type="checkbox" id="${list.name}" name="listname" class=" ${list.name} checkbox listdisplay" value="listname" checked/>`;
    } else {
      displayhtml += `<input type="checkbox" id="${list.name}" name="listname" class="${list.name} checkbox listdisplay" value="listname" />`;
    }
    displayhtml += `<span class="adminListName">
    ${list.name}</span><span class="listdelete">delete</span>
    `;

    //
    if (list.default == true) {
      displayhtml += `<input type="checkbox" id="${list.name}" name="listname" class="${list.name} default checkbox" value="listname" checked />default`;
    } else {
      displayhtml += `<input type="checkbox" id="${list.name}" name="listname" class="${list.name} default checkbox" value="listname" />default`;
    }

    //

    //
    if (list.more == true) {
      displayhtml += `<input type="checkbox" id="${list.name}" name="listname" class="${list.name} more checkbox" value="listname" checked />more </div>`;
    } else {
      displayhtml += `<input type="checkbox" id="${list.name}" name="listname" class="${list.name} more checkbox" value="listname" />more </div>`;
    }

    //
  }
  document.querySelector(".adminMainLists").innerHTML = displayhtml;
};

dugwardButton.addEventListener("click", openAdmin);

//if list checkbox is checked, database value for disply = true, if unchecked it = false
document
  .querySelector(".adminMainLists")
  .addEventListener("click", async (e) => {
    if (e.target.classList.contains("listdisplay")) {
      const q = query(lists, where("name", "==", e.target.id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        if (e.target.checked == true) {
          updateDoc(doc.ref, {
            display: true,
          });
          //update allLists object
          allLists[doc.data().name].display = true;
        } else {
          updateDoc(doc.ref, {
            display: false,
            default: false,
          });
          //update allLists object
          console.log(allLists[e.target.id]);
          allLists[e.target.id].display = false;
          allLists[e.target.id].default = false;
          console.log(allLists[e.target.id]);
          document.querySelector(".default").checked = false;
        }
      });
    }
  });

//if default checkbox is checked, database value for default = true, if unchecked it = false
document
  .querySelector(".adminMainLists")
  .addEventListener("click", async (e) => {
    if (e.target.classList.contains("default")) {
      const q = query(lists, where("name", "==", e.target.id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (e.target.checked == true) {
          updateDoc(doc.ref, {
            default: true,
            display: true,
          });
          //update allLists object
          allLists[doc.data().name].default = true;
          allLists[doc.data().name].display = true;

          document.querySelector(".listdisplay").checked = true;
          //push list name to listoflists array
          listoflists.push(e.target.id);
          console.log(listoflists);
        } else {
          updateDoc(doc.ref, {
            default: false,
          });
          //update allLists object
          allLists[doc.data().name].default = false;
          //remove list name from listoflists array
          listoflists = listoflists.filter((item) => item !== e.target.id);
          console.log(listoflists);
        }
      });
    }
  });

//if more checkbox is checked, database value for more = true, if unchecked it = false
document
  .querySelector(".adminMainLists")
  .addEventListener("click", async (e) => {
    if (e.target.classList.contains("more")) {
      const q = query(lists, where("name", "==", e.target.id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (e.target.checked == true) {
          updateDoc(doc.ref, {
            more: true,
          });
          //update allLists object
          allLists[doc.data().name].more = true;
        } else {
          updateDoc(doc.ref, {
            more: false,
          });
          //update allLists object
          allLists[doc.data().name].more = false;
        }
      });
    }
  });

// close main admin
document.querySelector(".adminback").addEventListener("click", () => {
  nonDugward.style.display = "block";
  adminMain.style.display = "none";
  if (w <= 700) {
    closeMenu();
  }
  putEmUpMain();
});

//event listener for delete buttons that remove list from database and html
document
  .querySelector(".adminMainLists")
  .addEventListener("click", async (e) => {
    if (e.target.classList.contains("listdelete")) {
      const q = query(lists, where("name", "==", e.target.parentNode.id));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
        delete allLists[e.target.parentNode.id];
      });
      e.target.parentNode.remove();
    }
  });

// add list button

document.querySelector(".addlist").addEventListener("click", () => {
  adminMain.style.display = "none";
  document.querySelector(".listEntry").style.display = "block";
  if (w <= 700) {
    closeMenu();
  }
});

// add list back button

document.querySelector(".entryback").addEventListener("click", () => {
  document.querySelector(".listEntry").style.display = "none";
  openAdmin();
});

// the login button

loginButton.addEventListener("click", function (e) {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
      loginButton.style.display = "none";
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
});

// the logout button

document.querySelector(".logoutButton").addEventListener("click", () => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      console.log("logged out");
      user = {};
      var allUsers = {};
      var allLists = {};
      var allMovies = {};
      loginButton.style.display = "block";
      nonDugward.style.display = "none";
      //hide footer
      document.querySelector("footer").style.display = "none";
      if (w <= 700) {
        closeMenu();
      }
      document.querySelector(".dugwardButton").style.display = "none";
    })
    .catch((error) => {
      // An error happened.
    });
});

// AUTH CHANGE

var user;
var userName;
var userDoc;
var allUsers = {};
var allLists = {};
var allMovies = {};
var clickedUserName = "";

onAuthStateChanged(auth, async function (u) {
  //hide wrapper
  document.querySelector(".wrapper").style.display = "none";
  if (u) {
    spinnerTop.style.display = "block";
    user = u;
    // console.log(user);
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      userDoc = docSnap.data();
      console.log("User data:", userDoc);
      console.log(user);
      userName = userDoc.name;

      if (userDoc.admin == true) {
        if (w > 700) {
          document.querySelector(".dugwardButton").style.display = "block";
        }
      }
    } else {
      // docSnap.data() will be undefined in this case
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        moviesSeen: [],
        admin: false,
        topFive: [],
      });
      userDoc = {
        name: user.displayName,
        moviesSeen: [],
        admin: false,
        topFive: [],
      };
      userName = user.displayName;
      console.log("new user entered:", user.displayName);

      // console.log(allUsers);
    }
    //replace allLists with the collection "lists" from the database
    const q = query(collection(db, "lists"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      allLists[doc.data().name] = doc.data();
    });
    allLists[`Your ${oscarYear} Top 5`] = {
      name: `Your ${oscarYear} Top 5`,
      display: true,
      default: false,
      more: false,
      description: `Your ${oscarYear} Top 5`,
      movielist: userDoc.topFive,
    };
    console.log(allLists);
    //replace allMovies with the collection "movies" from the database
    const q2 = query(collection(db, "movies"));
    const querySnapshot2 = await getDocs(q2);
    querySnapshot2.forEach((doc) => {
      allMovies[doc.data().id] = doc.data();
    });
    console.log(allMovies);
    //replace allUsers with the collection "users" from the database
    const q3 = query(collection(db, "users"));
    const querySnapshot3 = await getDocs(q3);
    querySnapshot3.forEach((doc) => {
      allUsers[doc.data().name] = doc.data();
    });
    console.log(allUsers);
    await defaultsToList();

    //show the footer
    document.querySelector("footer").style.display = "block";
    spinnerTop.style.display = "none";
    //show wrapper
    wrapper.style.display = "block";
    nonDugward.style.display = "block";
    //hide .blur
    document.querySelector(".blur").style.display = "none";
  } else {
    console.log("no one signed in");
    loginButton.style.display = "block";
    wrapper.style.display = "block";
  }
});
//CLEARING TOP 5s

//add event listener for .clear-top-five-pre that shows the confirm and cancel buttons and hides itself
document
  .querySelector(".clear-top-fives-pre")
  .addEventListener("click", function () {
    document.querySelector(".clear-top-fives-pre").style.display = "none";
    document.querySelector(".clear-top-fives-confirm").style.display =
      "inline-block";
    document.querySelector(".clear-top-fives-cancel").style.display =
      "inline-block";
  });

//add event listener for .clear-top-fives-cancel that hides the confirm and cancel buttons and shows the pre
document
  .querySelector(".clear-top-fives-cancel")
  .addEventListener("click", function () {
    document.querySelector(".clear-top-fives-pre").style.display =
      "inline-block";
    document.querySelector(".clear-top-fives-confirm").style.display = "none";
    document.querySelector(".clear-top-fives-cancel").style.display = "none";
  });

//add event listener for .clear-top-fives-confirm that clears all users in the database's topfives array and hides the confirm and cancel buttons and shows the pre
document
  .querySelector(".clear-top-fives-confirm")
  .addEventListener("click", async function () {
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      updateDoc(doc.ref, {
        topFive: [],
      });
      console.log(`${doc.data().name} + "'s top five cleared`);
    });
    //do the same for all movies, setting flagCount to 0
    const q2 = query(collection(db, "movies"));
    const querySnapshot2 = await getDocs(q2);
    querySnapshot2.forEach((doc) => {
      updateDoc(doc.ref, {
        flagCount: 0,
      });
      console.log(`${doc.data().title} + "'s flag count cleared`);
    });

    document.querySelector(".clear-top-fives-pre").style.display =
      "inline-block";
    document.querySelector(".clear-top-fives-confirm").style.display = "none";
    document.querySelector(".clear-top-fives-cancel").style.display = "none";
  });

// ADDING LISTS

var listDetails = [...Array()];

async function addinglists(newlist) {
  const listName = document.querySelector(".listnameentry").value;
  const docRef = doc(db, "lists", listName);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    listEntry.insertAdjacentHTML(
      "afterbegin",
      `<p style="color:red">list already exists!</p>`
    );
    return;
  } else {
    const newlistarray = newlist.split(/\n/);
    // console.log(newlistarray);
    //now function that looks up movie, gets info, adds them to an object, object to array of objects

    for (const thistitle of newlistarray) {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=b737a09f5864be7f9f38f1d5ad71c151&language=en-US&query=${thistitle}&page=1&include_adult=false`
      );
      const details = await response.json();

      if (details.results[0]) {
        listDetails.push({
          enteredTitle: thistitle,
          title: details.results[0].title,
          imageurl: details.results[0].poster_path,
          id: details.results[0].id,
          year: details.results[0].release_date.substring(0, 4),
          description: details.results[0].overview,
        });
        console.log(`${details.results[0].title} pulled from api`);
      } else {
        listDetails.push({
          enteredTitle: thistitle,
          title: "",
          imageurl: "",
          id: "",
          year: "",
          description: "",
        });
        console.log(`${thistitle} not found in api`);
      }
    }

    listSearchResult.style.display = "block";
    listEntry.style.display = "none";

    //function that goes through array of objects and pushes them to an array of html
    //put up html}

    var listHtml = [];
    for (const film of listDetails) {
      //calculating shared characters
      //change both film.enteredTitle and film.title to lowercase, remove any non-letter characters, and separate letters into an array
      const enteredTitleArray = film.enteredTitle
        .toLowerCase()
        .replace(/[^a-z]/g, "")
        .split("");
      const titleArray = film.title
        .toLowerCase()
        .replace(/[^a-z]/g, "")
        .split("");
      //take each letter in the shorter array (or either if they are equal in length) and check if it is in the longer array. If it is, remove it from the longer array (just one instance). then create a constant called 'difference' that is the remaining length of the longer array.
      if (enteredTitleArray.length <= titleArray.length) {
        for (const letter of enteredTitleArray) {
          if (titleArray.includes(letter)) {
            titleArray.splice(titleArray.indexOf(letter), 1);
          }
        }
        var difference = titleArray.length;
      } else {
        for (const letter of titleArray) {
          if (enteredTitleArray.includes(letter)) {
            enteredTitleArray.splice(enteredTitleArray.indexOf(letter), 1);
          }
        }
        var difference = enteredTitleArray.length;
      }

      //
      if (difference >= 3) {
        listHtml.push(`<div class="${film.id} listResultRow">
        <input type="text" id="" class="listResultNumber" value="${film.id}" /><span
      class="material-symbols-sharp reloadButton">restart_alt </span><div class="two-titles"> <span class="listResultEnteredTitle warning-red">${film.enteredTitle} (${difference})</span><span class="listResultTitle">${film.title}</span></div>`);
      } else {
        listHtml.push(`<div class="${film.id} listResultRow">
        <input type="text" id="" class="listResultNumber" value="${film.id}" /><span
      class="material-symbols-sharp reloadButton">restart_alt </span><div class="two-titles"> <span class="listResultEnteredTitle">${film.enteredTitle} (${difference})</span><span class="listResultTitle">${film.title}</span></div>`);
      }
      listHtml.push(`

    
    <span class="listeResultYear">${film.year}</span
    ><img class="listResultImage" src="https://image.tmdb.org/t/p/w200/${film.imageurl}" alt="" />
    <span  class="remove">Remove</span>
  </div>`);
    }

    listHtml.join(" ");
    listSearchResult.insertAdjacentHTML("afterbegin", listHtml);

    // add event listeners for .reloadButtons that take input from .listResultNumber and then look up the movie again and replace the html

    document.querySelectorAll(".reloadButton").forEach((button) => {
      button.addEventListener("click", async () => {
        const currentTitle =
          button.parentElement.querySelector(".listResultTitle").innerHTML;
        const currentId =
          button.parentElement.querySelector(".listResultNumber").value;
        // console.log(`current id= ${currentId}`);
        const newFilm =
          button.parentElement.querySelector(".listResultNumber").value;
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${newFilm}?api_key=xxxxxxxxxxxxxxxxxxxxxxxxxx`
        );
        const details = await response.json();
        // console.log(details);
        const newFilmDetails = {
          title: details.title,
          imageurl: details.poster_path,
          id: details.id,
          year: details.release_date.substring(0, 4),
          description: details.overview,
        };
        //replace old film object in listDetails with newFilmDetails
        const index = listDetails.findIndex(
          (film) => film.title === currentTitle
        );
        listDetails[index] = newFilmDetails;
        //replace old html with new html

        if (currentId) {
          button.parentElement.classList.remove(currentId);
        }
        button.parentElement.classList.add(newFilmDetails.id);
        button.parentElement.querySelector(".listResultNumber").value =
          newFilmDetails.id;
        button.parentElement.querySelector(".listResultTitle").innerHTML =
          newFilmDetails.title;
        button.parentElement.querySelector(".listeResultYear").innerHTML =
          newFilmDetails.year;
        button.parentElement.querySelector(
          ".listResultImage"
        ).src = `https://image.tmdb.org/t/p/w500/${newFilmDetails.imageurl}`;
        // console.log(listDetails);
      });
    });

    //add event listeners for .remove buttons that remove the film from the listDetails array and the html
    document.querySelectorAll(".remove").forEach((button) => {
      button.addEventListener("click", () => {
        const currentTitle =
          button.parentElement.querySelector(".listResultTitle").innerHTML;
        const index = listDetails.findIndex(
          (film) => film.title === currentTitle
        );
        listDetails.splice(index, 1);
        button.parentElement.remove();
        // console.log(listDetails);
      });
    });
  }
  //end of new list submit button click function below
}

document.querySelector(".listSubmit").addEventListener("click", () => {
  if (document.querySelector(".listInputbox").value) {
    addinglists(document.querySelector(".listInputbox").value);
  }
});

// ADDING LISTS AND MOVIES TO DATABASE

document.querySelector(".finalsubmit").addEventListener("click", async () => {
  const listName = document.querySelector(".listnameentry").value;

  const listDescription = document.querySelector(".listdescription").value;
  const listItems = [...Array()];
  for (const film of listDetails) {
    listItems.push(film.id);
    //add each film to movies collection in database if it isn't already there
    const docRef = doc(db, "movies", film.id.toString());
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(doc(db, "movies", film.id.toString()), {
        title: film.title,
        imageurl: film.imageurl,
        id: film.id,
        year: film.year,
        description: film.description,
      });
      console.log(`${film.title} added to database`);
    }
  }
  await setDoc(doc(db, "lists", listName), {
    name: listName,
    description: listDescription,
    movielist: listItems,
    display: false,
    default: false,
    more: false,
  });
  console.log(`${listName}list added to database`);
  //replace allLists with the collection "lists" from the database
  const q = query(collection(db, "lists"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    allLists[doc.data().name] = doc.data();
  });
  console.log(`allLists: ${allLists}`);
  //replace allMovies with the collection "movies" from the database
  const q2 = query(collection(db, "movies"));
  const querySnapshot2 = await getDocs(q2);
  querySnapshot2.forEach((doc) => {
    allMovies[doc.data().id] = doc.data();
  });
  console.log(`allMovies: ${allMovies}`);
  //cleaning up
  listSearchResult.style.display = "none";
  listDetails = [...Array()];
  listSearchResult.innerHTML = "";
  openAdmin();
});

//function to add any lists from database with default to listoflists array
async function defaultsToList() {
  for (const listy in allLists) {
    const list = allLists[listy];
    if (list.default) {
      listoflists.push(list.name);
    }
  }
  // console.log(listoflists);
  await putEmUpMain();
  wrapper.style.display = "block";
}

//PROGRESS BAR FUNCTION

async function progressBar(total, part, insertDiv) {
  //make a constant that is the number of films that are in both userDoc.moviesSeen and allFilms array

  var setB = new Set(total);
  const seenAndUp = [...new Set(part)].filter((x) => setB.has(x));

  //make a constant that is the percentage of films the user has seen out of the movies currently displayed
  const percentage = Math.round((seenAndUp.length / total.length) * 100);

  insertDiv.innerHTML = `<div class="progress " style="width:${percentage}%"><span class="ratio ">${seenAndUp.length}/${total.length}</span></div>`;
}

//Grabbing list of selected films function

var awardFilms = [];
var moreFilms = [];
var allFilms = [];

async function grabSelectedFilms() {
  awardFilms = [];
  moreFilms = [];
  allFilms = [];
  for (const listy of listoflists) {
    const list = allLists[listy];
    for (const film of list.movielist) {
      //if the film is not more=true, add it to the awardFilms array
      if (!allLists[listy].more) {
        //if it is not in the moreFilms array, add it to the awardFilms array
        if (!moreFilms.includes(film)) {
          awardFilms.push(film);
        }
      } else {
        //if it is not in the awardFilms array, add it to the moreFilms array
        if (!awardFilms.includes(film)) {
          moreFilms.push(film);
        }
      }
    }
  }
  //remove duplicates from awardFilms and moreFilms
  console.log(awardFilms);
  awardFilms = [...new Set(awardFilms)];
  console.log(awardFilms);
  moreFilms = [...new Set(moreFilms)];
  allFilms = [...new Set([...awardFilms, ...moreFilms])];
}

async function starClicked(id) {
  //if the user's top five has 5 films in it
  if (allUsers[userName].topFive.length >= 5) {
    listoflists = [`Your ${oscarYear} Top 5`];
    putEmUpMain();
    document.querySelector(".five-warning").style.display = "block";
  } else {
    //add the id to the user's topFive remotely and in allUsers
    allUsers[userName].topFive.push(id);
    //add the id to the ýour ${oscarYear} Top 5 list in allLists
    allLists[`Your ${oscarYear} Top 5`].movielist.push(parseInt(id));
    //add it to the user's topFive in the database (with arrayUnion)
    const userRef = doc(db, "users", user.uid);

    await updateDoc(userRef, {
      topFive: arrayUnion(id),
    });
    //iterate the count in flagCount remotely and in allMovies
    allMovies[id].flagCount++;
    //iterate the count in flagCount in the database using firebase v9
    const movieRef = doc(db, "movies", id.toString());
    await updateDoc(movieRef, {
      flagCount: increment(1),
    });
    // console.log(allMovies[id].flagCount);
    if (allMovies[id].flagCount >= 1) {
      //find the box with the id and change the .corner-ribbon to visibility:visible
      document
        .getElementById(id)
        .querySelector(".corner-ribbon").style.visibility = "visible";
      document
        .getElementById(id)
        .querySelector(".top-5-number").style.visibility = "visible";
      document.getElementById(id).querySelector(".top-5-number").innerHTML =
        allMovies[id].flagCount;
    }
  }
}

async function starUnclicked(id) {
  //remove the id from the user's topFive remotely and in allUsers
  allUsers[userName].topFive = allUsers[userName].topFive.filter(
    (x) => x != id
  );
  //remove the id to the ýour ${oscarYear} Top 5 list in allLists
  allLists[`Your ${oscarYear} Top 5`].movielist.splice(
    allLists[`Your ${oscarYear} Top 5`].movielist.indexOf(parseInt(id)),
    1
  );
  //remove it from the user's topFive in the database (with arrayRemove)
  const userRef = doc(db, "users", user.uid);
  await updateDoc(userRef, {
    topFive: arrayRemove(id),
  });
  //iterate the count in flagCount remotely and in allMovies
  allMovies[id].flagCount--;
  //iterate the count in flagCount in the database using firebase v9
  const movieRef = doc(db, "movies", id.toString());
  await updateDoc(movieRef, {
    flagCount: increment(-1),
  });
  document.getElementById(id).querySelector(".top-5-number").innerHTML =
    allMovies[id].flagCount;
  if (allMovies[id].flagCount == 0) {
    //find the box with the id and change the .corner-ribbon to visibility:visible
    document
      .getElementById(id)
      .querySelector(".corner-ribbon").style.visibility = "hidden";
    document
      .getElementById(id)
      .querySelector(".top-5-number").style.visibility = "hidden";
  }
  //if .five-warning is visible, hide it
  if (document.querySelector(".five-warning").style.display == "block") {
    document.querySelector(".five-warning").style.display = "none";
  }
}

//PUT UP FILMS MAIN FUNCTION

async function putEmUpMain() {
  document.querySelector(".five-warning").style.display = "none";
  spinnerMain.style.display = "block";
  document.querySelector(".progressbar.main").style.display = "none";
  document.querySelector("main-grid").style.display = "none";
  await grabSelectedFilms();
  var gridhtml = [];
  for (const moviey of awardFilms) {
    var movieHtml = "";
    // find moviey in allMovies
    const movie = allMovies[moviey];

    if (movie.flagCount >= 1) {
      //if the user's topFive includes movie id
      if (allUsers[userName].topFive.includes(`${movie.id}`)) {
        movieHtml += `<div class="boxwrapper"><div class="${movie.title} box" id="${movie.id}">
       <div class="top-5-number">${movie.flagCount}</div>
     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="check-circle" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/> </svg>
     <div class="star-outline-box" style="display:none"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="star-outline"><title>star-outline</title><path d="M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z" /></svg></div>
     <div class="star-filled-box" style="display:block"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="star-filled"><title>star</title><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" /></svg>`;
      } else {
        movieHtml += `<div class="boxwrapper"><div class="${movie.title} box" id="${movie.id}">
       <div class="top-5-number">${movie.flagCount}</div>
     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="check-circle" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/> </svg>
     <div class="star-outline-box" style="display:block"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="star-outline"><title>star-outline</title><path d="M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z" /></svg></div>
     <div class="star-filled-box" style="display:none"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="star-filled"><title>star</title><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" /></svg>`;
      }

      movieHtml += `</div>
     <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" class="corner-ribbon" style="visibility: visible" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
    <g><path d="M942.2,990v-95.6l47.8-47.9v95.6L942.2,990z M10,57.9L57.9,10h95.6l-47.9,47.9H10z"/><path d="M57.9,10h370.6L990,571.8v370.5L57.9,10z"/><path d="M353.3,161.2l-26.8,26.7L308,169.3l80-80.1l28.2,28.2c5.6,5.6,9.7,11.2,12.5,16.5c2.7,5.5,4.1,10.6,4.5,15.6c0.3,4.9-0.5,9.6-2.6,14.1c-1.9,4.5-4.8,8.5-8.5,12.2c-4,4-8.3,7-13,9.1c-4.6,2.1-9.5,2.9-14.4,2.7c-5-0.3-10.2-1.8-15.6-4.5c-5.4-2.7-10.9-6.9-16.3-12.3L353.3,161.2z M367.4,147.1l9.6,9.6c4.8,4.8,9.5,7.2,13.9,7c4.5-0.2,8.7-2.4,12.8-6.4c1.7-1.8,3.2-3.9,4.2-5.8c1-2.1,1.4-4.2,1.4-6.4c0-2.2-0.7-4.5-1.8-6.7c-1.1-2.2-2.9-4.6-5.1-6.9l-9.6-9.6L367.4,147.1z"/><path d="M497.1,278.4c-5.8,5.8-12.2,10.3-19.2,13.1c-7.1,3-14.1,4.5-21.5,4.5s-14.6-1.4-21.8-4.5c-7.2-3.1-14-7.7-20.2-13.9c-6.2-6.2-10.9-13-13.9-20.2c-3.1-7.2-4.5-14.4-4.5-21.8s1.6-14.4,4.5-21.5c3-7,7.4-13.3,13.1-19.2c5.8-5.8,12.2-10.3,19.2-13.1c7.1-3.1,14.1-4.5,21.5-4.5c7.4,0,14.6,1.4,21.8,4.5c7.2,3,13.9,7.7,20.2,13.9c6.3,6.2,10.9,13,13.8,20.2c3.1,7.2,4.5,14.4,4.5,21.8c0,7.2-1.6,14.4-4.5,21.5C507.4,266.2,502.9,272.6,497.1,278.4z M478.2,259.3c4-4,7.1-8,9.2-12.2c2-4.2,3.4-8.3,3.7-12.5s-0.3-8.2-2.1-12.2c-1.6-4-4.1-7.7-7.7-11.2c-3.5-3.5-7.4-6.2-11.4-7.9c-4-1.6-8-2.2-12.2-2.1c-4.1,0.3-8.3,1.4-12.5,3.7c-4.1,2.1-8.3,5.1-12.2,9.1c-4,4-7.1,8-9.1,12.3c-2.1,4.1-3.4,8.3-3.7,12.5c-0.3,4.2,0.5,8.2,2.1,12.2c1.6,4,4.3,7.7,7.9,11.4c3.5,3.5,7.4,6.1,11.2,7.9c3.8,1.7,8,2.2,12,2.1c4.2-0.3,8.3-1.4,12.5-3.7C470.1,266.4,474.2,263.3,478.2,259.3z"/><path d="M511.4,319.1l-26.7,26.7L466,327.2l80.1-80.1l28.2,28.2c5.6,5.6,9.8,11.2,12.5,16.5c2.7,5.4,4.1,10.6,4.5,15.5c0.3,4.9-0.5,9.6-2.6,14.1c-1.9,4.5-4.8,8.5-8.5,12.2c-4,4-8.3,7-13,9.1c-4.7,2.1-9.5,2.9-14.4,2.7c-5-0.3-10.2-1.7-15.5-4.5c-5.5-2.7-10.9-6.9-16.3-12.3L511.4,319.1z M525.3,305.1l9.6,9.6c4.8,4.8,9.5,7.2,13.9,7c4.5-0.2,8.7-2.4,12.8-6.4c1.8-1.8,3.2-3.8,4.2-5.8c1-2.1,1.4-4.1,1.4-6.4s-0.7-4.5-1.8-6.7c-1.1-2.2-2.9-4.6-5.1-6.9l-9.6-9.6L525.3,305.1z"/><path d="M584.1,415.9c2.6,2.6,5.1,4.3,7.9,5.5c2.7,1.1,5.6,1.6,8.5,1.4c2.9-0.2,5.8-1,8.8-2.6c2.9-1.4,5.8-3.7,8.6-6.4l47.4-47.4l18.6,18.6l-47.4,47.4c-5,5-10.3,8.7-15.9,11.1c-5.8,2.6-11.5,3.7-17.4,3.7s-11.9-1.3-17.8-3.8c-5.9-2.6-11.6-6.6-16.8-11.9c-5.3-5.3-9.3-10.9-11.9-16.8c-2.5-5.9-3.8-11.9-3.8-17.8c0-5.9,1.3-11.7,3.8-17.4c2.6-5.6,6.3-10.9,11.2-15.9l47.4-47.4l18.6,18.6l-47.4,47.4c-2.9,2.9-4.9,5.8-6.4,8.6c-1.4,2.9-2.4,5.9-2.5,8.8c-0.2,2.9,0.3,5.8,1.4,8.5C579.8,410.8,581.5,413.5,584.1,415.9z"/><path d="M649.2,480.8l29.7,29.6L664,525.3l-48.2-48.2l80.1-80.1l18.6,18.6L649.2,480.8z"/><path d="M747.4,608.6L733,594.2c-1.6-1.6-2.6-3.4-2.9-5.1c-0.3-1.7,0-3.5,0.6-5.1l9.3-18.7l-30.4-30.4l-18.8,9.3c-1.4,0.7-3.1,0.8-5,0.7c-1.9-0.2-3.5-1.1-5.1-2.7l-14.6-14.6l111-49l19.1,19.1L747.4,608.6z M726.6,526.6l21.9,21.9l14.6-29.3c1-1.9,1.9-4,3.2-6.6c1.3-2.6,2.7-5.1,4.2-8c-2.9,1.6-5.5,3.1-8,4.3c-2.5,1.3-4.8,2.4-6.7,3.2L726.6,526.6z"/><path d="M802,604.1l-29.6,29.6l-18.6-18.6l80.1-80.1l26.1,26.1c5.8,5.8,10.1,11.4,13,16.7c2.9,5.3,4.6,10.3,4.9,14.9c0.5,4.7-0.1,9.2-1.9,13.2c-1.7,4-4.3,7.9-7.7,11.2c-2.6,2.6-5.5,4.7-8.3,6.3c-3.1,1.6-6.2,2.7-9.4,3.4c-3.4,0.7-6.8,0.7-10.3,0.1c-3.5-0.4-7-1.4-10.7-3.1c0.7,1.9,1,3.9,1.1,5.8c0.2,1.9,0,4-0.5,6.2l-10.9,44.8l-16.8-16.8c-3.1-3-4.1-6.5-3.2-10.2l9.9-36.6c0.5-1.6,0.5-3.1,0.2-4.3c-0.3-1.3-1.3-2.6-2.7-4L802,604.1z M814.8,591.3l7.5,7.5c2.6,2.5,5,4.3,7.4,5.4c2.4,1.1,4.8,1.7,7.1,1.7c2.2,0,4.5-0.5,6.4-1.4c2.1-1,4-2.4,5.8-4.2c3.5-3.5,5.1-7.3,4.8-11.7c-0.3-4.3-2.9-8.8-7.7-13.6l-7.5-7.5L814.8,591.3z"/></g>
    </svg>`;
      //
    } else {
      movieHtml += `<div class="boxwrapper"><div class="${movie.title} box" id="${movie.id}">
       <div class="top-5-number" style="visibility: hidden">3</div>
     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="check-circle" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/> </svg> <div class="star-outline-box" style="display: block"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="star-outline"><title>star-outline</title><path d="M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z" /></svg></div>
     <div class="star-filled-box" style="display: none"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="star-filled"><title>star</title><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" /></svg></div>
     <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" class="corner-ribbon" style="visibility: hidden" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
    <g><path d="M942.2,990v-95.6l47.8-47.9v95.6L942.2,990z M10,57.9L57.9,10h95.6l-47.9,47.9H10z"/><path d="M57.9,10h370.6L990,571.8v370.5L57.9,10z"/><path d="M353.3,161.2l-26.8,26.7L308,169.3l80-80.1l28.2,28.2c5.6,5.6,9.7,11.2,12.5,16.5c2.7,5.5,4.1,10.6,4.5,15.6c0.3,4.9-0.5,9.6-2.6,14.1c-1.9,4.5-4.8,8.5-8.5,12.2c-4,4-8.3,7-13,9.1c-4.6,2.1-9.5,2.9-14.4,2.7c-5-0.3-10.2-1.8-15.6-4.5c-5.4-2.7-10.9-6.9-16.3-12.3L353.3,161.2z M367.4,147.1l9.6,9.6c4.8,4.8,9.5,7.2,13.9,7c4.5-0.2,8.7-2.4,12.8-6.4c1.7-1.8,3.2-3.9,4.2-5.8c1-2.1,1.4-4.2,1.4-6.4c0-2.2-0.7-4.5-1.8-6.7c-1.1-2.2-2.9-4.6-5.1-6.9l-9.6-9.6L367.4,147.1z"/><path d="M497.1,278.4c-5.8,5.8-12.2,10.3-19.2,13.1c-7.1,3-14.1,4.5-21.5,4.5s-14.6-1.4-21.8-4.5c-7.2-3.1-14-7.7-20.2-13.9c-6.2-6.2-10.9-13-13.9-20.2c-3.1-7.2-4.5-14.4-4.5-21.8s1.6-14.4,4.5-21.5c3-7,7.4-13.3,13.1-19.2c5.8-5.8,12.2-10.3,19.2-13.1c7.1-3.1,14.1-4.5,21.5-4.5c7.4,0,14.6,1.4,21.8,4.5c7.2,3,13.9,7.7,20.2,13.9c6.3,6.2,10.9,13,13.8,20.2c3.1,7.2,4.5,14.4,4.5,21.8c0,7.2-1.6,14.4-4.5,21.5C507.4,266.2,502.9,272.6,497.1,278.4z M478.2,259.3c4-4,7.1-8,9.2-12.2c2-4.2,3.4-8.3,3.7-12.5s-0.3-8.2-2.1-12.2c-1.6-4-4.1-7.7-7.7-11.2c-3.5-3.5-7.4-6.2-11.4-7.9c-4-1.6-8-2.2-12.2-2.1c-4.1,0.3-8.3,1.4-12.5,3.7c-4.1,2.1-8.3,5.1-12.2,9.1c-4,4-7.1,8-9.1,12.3c-2.1,4.1-3.4,8.3-3.7,12.5c-0.3,4.2,0.5,8.2,2.1,12.2c1.6,4,4.3,7.7,7.9,11.4c3.5,3.5,7.4,6.1,11.2,7.9c3.8,1.7,8,2.2,12,2.1c4.2-0.3,8.3-1.4,12.5-3.7C470.1,266.4,474.2,263.3,478.2,259.3z"/><path d="M511.4,319.1l-26.7,26.7L466,327.2l80.1-80.1l28.2,28.2c5.6,5.6,9.8,11.2,12.5,16.5c2.7,5.4,4.1,10.6,4.5,15.5c0.3,4.9-0.5,9.6-2.6,14.1c-1.9,4.5-4.8,8.5-8.5,12.2c-4,4-8.3,7-13,9.1c-4.7,2.1-9.5,2.9-14.4,2.7c-5-0.3-10.2-1.7-15.5-4.5c-5.5-2.7-10.9-6.9-16.3-12.3L511.4,319.1z M525.3,305.1l9.6,9.6c4.8,4.8,9.5,7.2,13.9,7c4.5-0.2,8.7-2.4,12.8-6.4c1.8-1.8,3.2-3.8,4.2-5.8c1-2.1,1.4-4.1,1.4-6.4s-0.7-4.5-1.8-6.7c-1.1-2.2-2.9-4.6-5.1-6.9l-9.6-9.6L525.3,305.1z"/><path d="M584.1,415.9c2.6,2.6,5.1,4.3,7.9,5.5c2.7,1.1,5.6,1.6,8.5,1.4c2.9-0.2,5.8-1,8.8-2.6c2.9-1.4,5.8-3.7,8.6-6.4l47.4-47.4l18.6,18.6l-47.4,47.4c-5,5-10.3,8.7-15.9,11.1c-5.8,2.6-11.5,3.7-17.4,3.7s-11.9-1.3-17.8-3.8c-5.9-2.6-11.6-6.6-16.8-11.9c-5.3-5.3-9.3-10.9-11.9-16.8c-2.5-5.9-3.8-11.9-3.8-17.8c0-5.9,1.3-11.7,3.8-17.4c2.6-5.6,6.3-10.9,11.2-15.9l47.4-47.4l18.6,18.6l-47.4,47.4c-2.9,2.9-4.9,5.8-6.4,8.6c-1.4,2.9-2.4,5.9-2.5,8.8c-0.2,2.9,0.3,5.8,1.4,8.5C579.8,410.8,581.5,413.5,584.1,415.9z"/><path d="M649.2,480.8l29.7,29.6L664,525.3l-48.2-48.2l80.1-80.1l18.6,18.6L649.2,480.8z"/><path d="M747.4,608.6L733,594.2c-1.6-1.6-2.6-3.4-2.9-5.1c-0.3-1.7,0-3.5,0.6-5.1l9.3-18.7l-30.4-30.4l-18.8,9.3c-1.4,0.7-3.1,0.8-5,0.7c-1.9-0.2-3.5-1.1-5.1-2.7l-14.6-14.6l111-49l19.1,19.1L747.4,608.6z M726.6,526.6l21.9,21.9l14.6-29.3c1-1.9,1.9-4,3.2-6.6c1.3-2.6,2.7-5.1,4.2-8c-2.9,1.6-5.5,3.1-8,4.3c-2.5,1.3-4.8,2.4-6.7,3.2L726.6,526.6z"/><path d="M802,604.1l-29.6,29.6l-18.6-18.6l80.1-80.1l26.1,26.1c5.8,5.8,10.1,11.4,13,16.7c2.9,5.3,4.6,10.3,4.9,14.9c0.5,4.7-0.1,9.2-1.9,13.2c-1.7,4-4.3,7.9-7.7,11.2c-2.6,2.6-5.5,4.7-8.3,6.3c-3.1,1.6-6.2,2.7-9.4,3.4c-3.4,0.7-6.8,0.7-10.3,0.1c-3.5-0.4-7-1.4-10.7-3.1c0.7,1.9,1,3.9,1.1,5.8c0.2,1.9,0,4-0.5,6.2l-10.9,44.8l-16.8-16.8c-3.1-3-4.1-6.5-3.2-10.2l9.9-36.6c0.5-1.6,0.5-3.1,0.2-4.3c-0.3-1.3-1.3-2.6-2.7-4L802,604.1z M814.8,591.3l7.5,7.5c2.6,2.5,5,4.3,7.4,5.4c2.4,1.1,4.8,1.7,7.1,1.7c2.2,0,4.5-0.5,6.4-1.4c2.1-1,4-2.4,5.8-4.2c3.5-3.5,5.1-7.3,4.8-11.7c-0.3-4.3-2.9-8.8-7.7-13.6l-7.5-7.5L814.8,591.3z"/></g>
    </svg>`;
    }

    movieHtml += `<img
          src="https://image.tmdb.org/t/p/original/${movie.imageurl}"
          alt="poster of ${movie.title}" rel="preload" class="poster"
        /></div>
            <div class="${movie.id} boxtitle " id="${movie.id}">
              <span class="movietitle"><a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank">${movie.title}</a></span><span class="editmovie"> edit</span>

            </div>
          </div>`;
    gridhtml.push(movieHtml);
    //REMOVE BEWLOW FOR OSCAR SEASON (DOWN TO WARNING END)
    //find moviey in allMovies
    //     const movie = allMovies[moviey];

    //     gridhtml.push(`<div class="boxwrapper"><div class="${movie.title} box" id="${movie.id}">

    //  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="check-circle" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/> </svg>
    //                    <img
    //       src="https://image.tmdb.org/t/p/original/${movie.imageurl}"
    //       alt="poster of ${movie.title}" rel="preload" class="poster"
    //     /></div>
    //         <div class="${movie.id} boxtitle-more " id="${movie.id}">
    //           <span class="movietitle"><a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank">${movie.title}</a></span><span class="editmovie"> edit</span>

    //         </div>
    //       </div>`);
    //DELETE ABOVE FOR OSCAR SEASON
  }

  for (const moviey of moreFilms) {
    //find moviey in allMovies
    const movie = allMovies[moviey];

    gridhtml.push(`<div class="boxwrapper"><div class="${movie.title} box" id="${movie.id}">
        

 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="check-circle" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/> </svg> 
                   <img
      src="https://image.tmdb.org/t/p/original/${movie.imageurl}"
      alt="poster of ${movie.title}" rel="preload" class="poster"
    /></div>
        <div class="${movie.id} boxtitle-more " id="${movie.id}">
          <span class="movietitle"><a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank">${movie.title}</a></span><span class="editmovie"> edit</span>
          

        </div>
      </div>`);
  }

  gridhtml.sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );
  gridhtml = gridhtml.join(" ");

  document.querySelector("main-grid").innerHTML = gridhtml;

  //add event listeners for .box elements
  document.querySelectorAll(".box").forEach((thing) => {
    thing.addEventListener("click", (e) => {
      const box = thing;

      const currentId = box.id;
      if (
        !e.target.classList.contains("star-outline-box") &&
        !e.target.classList.contains("star-filled-box")
      ) {
        const box = thing;

        const currentId = box.id;
        const currentTitle =
          box.parentElement.querySelector(".movietitle").textContent;
        //if the box does not have the class checked
        if (!box.classList.contains("checked")) {
          //add the class checked
          box.classList.add("checked");
          //add the film to the user's moviesSeen array on the database
          const docRef = doc(db, "users", `${user.uid}`);
          updateDoc(docRef, {
            moviesSeen: arrayUnion(currentId),
          });
          //add movie id to user's entry in allUsers object

          allUsers[userName].moviesSeen.push(currentId);
          console.log(
            `${currentTitle} (${currentId}) added to moviesSeen array`
          );
          // console.log(allUsers);
          //add movie id to userDoc.moviesSeen array
          userDoc.moviesSeen.push(currentId);
          //make the poster image opacity .4
          box.querySelector(".poster").style.opacity = ".2";
          //make the check circle visible
          box.querySelector(".check-circle").style.display = "block";
        } else {
          //remove the class checked
          box.classList.remove("checked");
          //remove the film from the user's moviesSeen array on the database
          const docRef = doc(db, "users", `${user.uid}`);
          updateDoc(docRef, {
            moviesSeen: arrayRemove(currentId),
          });
          //remove movie id to user's entry in allUsers object

          allUsers[userName].moviesSeen.splice(
            allUsers[userName].moviesSeen.indexOf(currentId),
            1
          );
          console.log(
            `${currentTitle} (${currentId}) removed from moviesSeen array`
          );
          // console.log(allUsers);
          //remove movie id from  userDoc.moviesSeen array
          userDoc.moviesSeen.splice(userDoc.moviesSeen.indexOf(currentId), 1);

          //make the poster image opacity 1
          box.querySelector(".poster").style.opacity = "1";
          //make the check circle invisible
          box.querySelector(".check-circle").style.display = "none";
        }
        var moviesSeenNew = userDoc.moviesSeen.map(function (str) {
          // using map() to convert array of strings to numbers
          return parseInt(str);
        });
        progressBar(
          allFilms,
          moviesSeenNew,
          document.querySelector(".progressbar.main")
        );
      }
      if (e.target.classList.contains("star-outline-box")) {
        console.log(`${currentId} added to top 5`);
        starClicked(currentId);
        //hide the star-outline and display the star-filled
        e.target.style.display = "none";
        e.target.parentElement.querySelector(".star-filled-box").style.display =
          "block";
      }

      if (e.target.classList.contains("star-filled-box")) {
        console.log(`${currentId} removed from top 5`);
        starUnclicked(currentId);
        //hide the star-outline and display the star-filled
        e.target.style.display = "none";
        e.target.parentElement.querySelector(
          ".star-outline-box"
        ).style.display = "block";
      }
    });
  });
  //add event listeners for .editmovie elements
  document.querySelectorAll(".editmovie").forEach((edit) => {
    edit.addEventListener("click", () => {
      //get the id of the movie to be edited
      const currentId = edit.parentElement.id;
      //display the edit-movie div block
      document.querySelector("#edit-div").style.display = "block";
      //when edit-div-enter button is pressed, get the id from the input and run the editMovie function
      document
        .querySelector("#edit-div-enter")
        .addEventListener("click", () => {
          //pass the current id and the new id to the editMovie function
          editMovie(currentId, document.querySelector(".newid").value);
        });
    });
  });

  //add event listeners for edit-div-cancel
  document.querySelector(".edit-div-cancel").addEventListener("click", () => {
    //hide the edit-movie div
    document.querySelector("#edit-div").style.display = "none";
  });

  //  for each film of the user's movies seen in the allUsers object
  for (const film in allUsers[userName].moviesSeen) {
    //if the film is currently displayed
    if (document.getElementById(allUsers[userName].moviesSeen[film])) {
      //add the class checked
      const box = document.getElementById(allUsers[userName].moviesSeen[film]);
      box.classList.add("checked");
      //make the poster image opacity .4
      box.querySelector(".poster").style.opacity = ".2";
      //make the check circle visible
      box.querySelector(".check-circle").style.display = "block";
    }
  }

  var moviesSeenNew = userDoc.moviesSeen.map(function (str) {
    // using map() to convert array of strings to numbers
    return parseInt(str);
  });
  progressBar(
    allFilms,
    moviesSeenNew,
    document.querySelector(".progressbar.main")
  );

  document.querySelector("main-grid").style.display = "flex";
  document.querySelector(".progressbar.main").style.display = "block";
  spinnerMain.style.display = "none";
  if (userDoc.admin == true) {
    //change all edit buttons to display block
    const editButtons = document.querySelectorAll(".editmovie");
    editButtons.forEach((button) => {
      button.style.display = "inline-block";
    });
  }
}

//the editMovie function takes an id and changes the movie id in the lists in the database and the users' moviesSeen in the database, then executes the putEmUpMain function
async function editMovie(id, newId) {
  //update all users who have the old id (converted to string) in moviesSeen from the database
  // console.log(id);
  const q = query(
    collection(db, "users"),
    where("moviesSeen", "array-contains", `${id}`)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (docu) => {
    // console.log(docu.data());
    // doc.data() is never undefined for query doc snapshots
    const userRef = doc(db, "users", docu.id);
    await updateDoc(userRef, {
      moviesSeen: arrayRemove(id),
    });
    await updateDoc(userRef, {
      moviesSeen: arrayUnion(newId),
    });

    console.log(
      `${id} changed to ${newId} in ${docu.data().name} moviesSeen array`
    );
  });

  const qu = query(
    collection(db, "lists"),
    where("movielist", "array-contains", parseInt(id))
  );
  const querySnapshot2 = await getDocs(qu);
  // console.log(querySnapshot2);
  querySnapshot2.forEach(async (docu) => {
    // console.log(docu.data());
    // console.log(docu.id);
    // doc.data() is never undefined for query doc snapshots
    const listRef = doc(db, "lists", docu.id);
    await updateDoc(listRef, {
      movielist: arrayRemove(parseInt(id)),
    });
    await updateDoc(listRef, {
      movielist: arrayUnion(parseInt(newId)),
    });

    //lookup movie and add details to movies database

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${newId}?api_key=b737a09f5864be7f9f38f1d5ad71c151`
    );
    const details = await response.json();
    // console.log(details);
    const newFilmDetails = {
      title: details.title,
      imageurl: details.poster_path,
      id: details.id,
      year: details.release_date.substring(0, 4),
      description: details.overview,
    };

    const docRef = doc(db, "movies", newId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(doc(db, "movies", newId), {
        title: newFilmDetails.title,
        imageurl: newFilmDetails.imageurl,
        id: newFilmDetails.id,
        year: newFilmDetails.year,
        description: newFilmDetails.description,
      });
      //update the allMovies object
      allMovies[newId] = newFilmDetails;
      //delete old from allMovies
      delete allMovies[id];

      console.log(`${newFilmDetails.title} added to database`);
      putEmUpMain();
    } else {
      putEmUpMain();
    }

    console.log(`${id} changed to ${newId} in ${docu.id} list`);
  });
  document.querySelector("#edit-div").style.display = "none";
}
