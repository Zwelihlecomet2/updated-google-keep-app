class Note {
  constructor(id, title, text) {
    this.id = id;
    this.title = title;
    this.text = text;
  }
}
class App {
  constructor(notes) {
    this.notes = [];
    this.selectedNoteId = "";
    this.miniSidebar = true;
    this.userId = "";

    this.$inactiveForm = document.querySelector(".inactive-form");
    this.$activeForm = document.querySelector(".active-form");
    this.$noteTitle = document.querySelector("#note-title");
    this.$noteText = document.querySelector("#note-text");
    this.$notes = document.querySelector(".notes");
    this.$form = document.querySelector("#form");
    this.$modal = document.querySelector(".modal");
    this.$modalForm = document.querySelector("#modal-form");
    this.$modalTitle = document.querySelector("#modal-Title");
    this.$modalText = document.querySelector("#modal-Text");
    this.$modalCloseButton = document.querySelector("#modal-close-btn");
    this.$sidebar = document.querySelector(".side-bar");
    this.$sidebarActiveItem = document.querySelector(".active-item");
    this.$menu = document.querySelector("#menu");
    this.$app = document.querySelector("#app");
    this.$logInPage = document.querySelector(".login-container");
    this.$signInButton = document.querySelector(".sign-in-btn");
    this.$signInWithGoogle = document.querySelector("#google");
    this.$logout = document.querySelector("#logout");

    // this.$firebaseuiAuthContainer = document.querySelector("#firebaseui-auth-container");
    // this.$signInWithGoogle = document.querySelector("#sign-in-with-google");

    this.handleAuthentication();
    this.addEventListeners();
    this.displayNote();
  }

  render() {
    this.saveNotes();
    this.displayNote();
  }

  addNote({ title, text }) {
    if (this.$noteTitle.value !== "" && this.$noteText.value !== "") {
      let newNote = { id: cuid(), title, text };
      this.notes = [...this.notes, newNote];
      this.render();
    } else {
      return;
    }
  }

  editNote(id, { title, text }) {
    this.notes.map((item) => {
      if (item.id === id) {
        item.title = title;
        item.text = text;
      }
      return item;
    });
    this.render();
  }

  deleteNote(id) {
    this.notes = this.notes.filter((item) => item.id !== id);
    this.render();
  }

  handleMouseOverNote(element) {
    let $note = document.querySelector("#" + element.id);
    let $checkNote = $note.querySelector(".check-circle");
    let $noteFooter = $note.querySelector(".note-footer");
    $checkNote.style.visibility = "visible";
    $noteFooter.style.visibility = "visible";
  }

  handleMouseOutNote(element) {
    let $note = document.querySelector("#" + element.id);
    let $checkNote = $note.querySelector(".check-circle");
    let $noteFooter = $note.querySelector(".note-footer");
    $checkNote.style.visibility = "hidden";
    $noteFooter.style.visibility = "hidden";
  }
  displayNote() {
    this.$notes.innerHTML = this.notes
      .map((item) => {
        return `
                    <div class="note" id="${item.id}">
                        <span class="material-symbols-outlined check-circle">check_circle</span>
                        <div class="title">${item.title}</div>
                        <div class="text">${item.text}</div>
                        <div class="note-footer">
                            <div class="tooltip">
                                <span class="material-symbols-outlined hover small-icons">add_alert</span>
                                <span class="tooltip-text">Remind me</span>
                            </div>
                            <div class="tooltip">
                                <span class="material-symbols-outlined hover small-icons">person_add</span>
                                <span class="tooltip-text">Collaborator</span>
                            </div>
                            <div class="tooltip">
                                <span class="material-symbols-outlined hover small-icons">palette</span>
                                <span class="tooltip-text">Change color</span>
                            </div>
                            <div class="tooltip">
                                <span class=  "material-symbols-outlined hover small-icons">image</span>
                                <span class="tooltip-text">Image</span>
                            </div>
                            <div class="tooltip archive">
                                <span class="material-symbols-outlined hover small-icons">archive</span>
                                <span class="tooltip-text">Archive</span>
                            </div>
                            <div class="tooltip">
                                <span class="material-symbols-outlined hover small-icons">more_vert</span>
                                <span class="tooltip-text">More</span>
                            </div>
                        </div>
                    </div>
                 `;
      })
      .join("");
  }

  addEventListeners() {
    document.body.addEventListener("click", (event) => {
      this.handleFormClick(event);
      this.closeModal(event);
      this.openModal(event);
      this.handleArchiving(event);
    });

    this.$form.addEventListener("submit", (event) => {
      event.preventDefault();

      let title = this.$noteTitle.value;
      let text = this.$noteText.value;

      this.addNote({ title, text });
      this.closeActiveForm();
    });

    this.$modalForm.addEventListener("submit", (event) => {
      event.preventDefault();
    });

    this.$sidebar.addEventListener("mouseover", (event) => {
      this.handleToggleSideBarHover(event);
    });

    this.$sidebar.addEventListener("mouseout", (event) => {
      this.handleToggleSideBarHover(event);
    });

    this.$menu.addEventListener("click", (event) => {
      this.handleToggleSideBarHover(event);
    });

    this.$signInButton.addEventListener("click", (event) =>{
        this.handleLoginWithEmailAndPassword(event);
     });

    this.$signInWithGoogle.addEventListener("click", () => {
      // google authentication Provider
      this.provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(this.provider);
    });

    this.$logout.addEventListener("click", (event) => {
      this.handleLogOut(event);
    });

  }

  handleFormClick() {
    let isInactiveFormClickedOn = this.$inactiveForm.contains(event.target);
    let isActiveFormClickedOn = this.$activeForm.contains(event.target);

    let title = this.$noteTitle.value;
    let text = this.$noteText.value;
    if (isInactiveFormClickedOn) {
      this.openActiveForm();
    } else if (!isInactiveFormClickedOn && !isActiveFormClickedOn) {
      this.addNote({ title, text });
      this.closeActiveForm();
    }
  }

  openActiveForm() {
    this.$activeForm.style.display = "block";
    this.$inactiveForm.style.display = "none";
    this.$noteText.focus();
  }

  closeActiveForm() {
    this.$inactiveForm.style.display = "block";
    this.$activeForm.style.display = "none";

    this.$noteTitle.value = "";
    this.$noteText.value = "";
  }

  openModal(event) {
    let $selectedNote = event.target.closest(".note");
    if ($selectedNote && !event.target.closest(".archive")) {
      this.selectedNoteId = $selectedNote.id;
      this.$modalTitle.value = $selectedNote.children[1].innerHTML;
      this.$modalText.value = $selectedNote.children[2].innerHTML;
      this.$modal.classList.add("open-modal");
    } else {
      return;
    }
  }

  closeModal(event) {
    let isModalFormClickedOn = this.$modalForm.contains(event.target);
    let isModalCloseButtonClickedOn = this.$modalCloseButton.contains(
      event.target
    );
    if (
      (!isModalFormClickedOn || isModalCloseButtonClickedOn) &&
      this.$modal.classList.contains("open-modal")
    ) {
      this.editNote(this.selectedNoteId, {
        title: this.$modalTitle.value,
        text: this.$modalText.value,
      });
      this.$modal.classList.remove("open-modal");
    } else {
      return;
    }
  }

  handleArchiving(event) {
    let $selectedNote = event.target.closest(".note");
    if ($selectedNote && event.target.closest(".archive")) {
      this.selectedNoteId = $selectedNote.id;
      this.deleteNote(this.selectedNoteId);
    } else {
      return;
    }
  }

  handleToggleSideBarHover() {
    if (this.miniSidebar) {
      this.$sidebar.style.width = "250px";
      this.$sidebar.classList.add("side-bar-hover");
      this.$sidebarActiveItem.classList.add("side-bar-active-items");
      this.miniSidebar = false;
    } else {
      this.$sidebar.style.width = "66px";
      this.$sidebar.classList.remove("side-bar-hover");
      this.$sidebarActiveItem.classList.remove("side-bar-active-items");
      this.miniSidebar = true;
    }
  }

  fetchNotesFromDataBase() {
    var docRef = db.collection("users").doc(this.userId);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data().notes);
          this.notes = doc.data().notes;
          this.displayNote();
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");

          db.collection("users")
            .doc(this.userId)
            .set({
              notes: [],
            })
            .then(() => {
              console.log("User successfully Created!");
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
            });
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }

  saveNotes() {
    db.collection("users")
      .doc(this.userId)
      .set({
        notes: this.notes,
      })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  }

  handleAuthentication() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        this.userId = user.uid;
        this.$logout.innerHTML = user.displayName;
        this.redirectToApp();
      } else {
        // User is signed out
        this.redirectToAuth();
      }
    });
  }

  redirectToApp() {
    this.$logInPage.style.display = "none";
    this.$app.style.display = "block";
    // this.$firebaseuiAuthContainer.style.display = "none";
    this.fetchNotesFromDataBase();
  }

  redirectToAuth() {
    this.$logInPage.style.display = "block";
    this.$app.style.display = "none";
    // this.ui.start("#firebaseui-auth-container", {
    //   callbacks: {
    //     signInSuccessWithAuthResult: function (authResult, redirectUrl) {
    //       // User successfully signed in.
    //       // Return type determines whether we continue the redirect automatically
    //       // or whether we leave that to developer to handle.
    //       this.redirectToApp();
    //       return false;
    //     },
    //     signInSuccessUrl: "facebook.com",
    //     signInFailure: (error) => {
    //       // For merge conflicts, the error.code will be
    //       // 'firebaseui/anonymous-upgrade-merge-conflict'.
    //       console.log(error);

    //       if (error.code != "firebaseui/anonymous-upgrade-merge-conflict") {
    //         return Promise.resolve();
    //       }
    //     },

    //     // (authResult, redirectUrl) => {
    //     //   // User successfully signed in.
    //     //   // Return type determines whether we continue the redirect automatically
    //     //   // or whether we leave that to developer to handle.
    //     //   console.log("Hello", authResult);

    //     //   this.userId = authResult.user.uid;
    //     //   this.$logout.innerHTML = user.displayName;
    //     //   this.redirectToApp();
    //     // }
    //   },
    //   signInOptions: [
    //     firebase.auth.EmailAuthProvider.PROVIDER_ID,
    //     firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    //   ],
    //   // Other config options...
    // });
  }

  handleLoginWithEmailAndPassword(){
    this.$email = document.querySelector("#email").value;
    this.$password = document.querySelector("#password").value;

    firebase.auth().createUserWithEmailAndPassword(this.$email, this.$password)
    .then((userCredential) => {
      // Signed in 
      this.user = userCredential.user;
      // ...
        this.redirectToApp();
    })
  .catch((error) => {
    this.errorCode = error.code;
   var errorMessage = error.message;
    // ..
    alert(errorMessage);
    this.redirectToAuth();
    });
  }

  handleLogOut() {
    firebase.auth().signOut()
      .then(() => {
        // Sign-out successful.
        this.redirectToAuth();
      })
      .catch((error) => {
        // An error happened.
        alert(error);
      });
  }
}

let app = new App();
