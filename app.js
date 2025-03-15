class Note{
    constructor(id, title, text){
        this.id = id;
        this.title = title;
        this.text = text;
    }
}
class App{
    constructor(notes){
        this.notes = JSON.parse(localStorage.getItem(`notes`)) || [];
        this.selectedNoteId = "";
        this.miniSidebar = true;

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

        this.addEventListeners();
        this.render();
    }

    render(){
        this.saveNotes();
        this.displayNote();
    }

    addNote({title, text}){
        if(this.$noteTitle.value !== "" && this.$noteText.value !== ""){
            let newNote = new Note(cuid(), title, text);
            this.notes = [...this.notes, newNote];
            this.render();
        }
        else{
            return;
        }
    }

    editNote(id, {title, text}){
        this.notes.map((item) =>{
            if(item.id === id){
                item.title = title;
                item.text = text;
            }
            return item;
        });
        this.render();
    }

    deleteNote(id){
        this.notes = this.notes.filter((item) => item.id !== id);
        this.render();
    }

    handleMouseOverNote(element){
        let $note = document.querySelector("#" + element.id);
        let $checkNote = $note.querySelector(".check-circle");
        let $noteFooter = $note.querySelector(".note-footer");
        $checkNote.style.visibility = "visible";
        $noteFooter.style.visibility = "visible";
    }
 
    handleMouseOutNote(element){
        let $note = document.querySelector("#" + element.id);
        let $checkNote = $note.querySelector(".check-circle");
        let $noteFooter = $note.querySelector(".note-footer");
        $checkNote.style.visibility = "hidden";
        $noteFooter.style.visibility = "hidden";
    }
    displayNote(){
        this.$notes.innerHTML = this.notes.map((item) =>{
        return   `
                    <div class="note" id="${item.id}" onmouseover="app.handleMouseOverNote(this)" onmouseout="app.handleMouseOutNote(this)">
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
                 `
        }).join("");
    }

    addEventListeners(){
        document.body.addEventListener("click", (event) =>{
            this.handleFormClick(event);
            this.closeModal(event);
            this.openModal(event);
            this.handleArchiving(event);
        });

        this.$form.addEventListener("submit", (event) =>{
            event.preventDefault();

            let title = this.$noteTitle.value;
            let text = this.$noteText.value;

            this.addNote({title, text});
            this.closeActiveForm();
        });

        this.$modalForm.addEventListener("submit", (event) =>{
            event.preventDefault();
        });

        this.$sidebar.addEventListener("mouseover", (event) =>{
            this.handleToggleSideBarHover(event);
        });

        this.$sidebar.addEventListener("mouseout", (event) =>{
            this.handleToggleSideBarHover(event);
        });

        this.$menu.addEventListener("click", (event) =>{
            this.handleToggleSideBarHover(event);
        });
    };

    handleFormClick(){
        let isInactiveFormClickedOn = this.$inactiveForm.contains(event.target);
        let isActiveFormClickedOn = this.$activeForm.contains(event.target);

        let title = this.$noteTitle.value;
        let text = this.$noteText.value;
        if(isInactiveFormClickedOn){
            this.openActiveForm();
        }

        else if(!isInactiveFormClickedOn && !isActiveFormClickedOn){
            this.addNote({title, text});
            this.closeActiveForm();
        }
    };

    openActiveForm(){
        this.$activeForm.style.display = "block";
        this.$inactiveForm.style.display = "none";
        this.$noteText.focus();
    }

    closeActiveForm(){
        this.$inactiveForm.style.display = "block";
        this.$activeForm.style.display = "none";

        this.$noteTitle.value = "";
        this.$noteText.value = "";
    }

    openModal(event){
        let $selectedNote = event.target.closest(".note");
        if($selectedNote && !event.target.closest(".archive")){
            this.selectedNoteId = $selectedNote.id;
            this.$modalTitle.value = $selectedNote.children[1].innerHTML;
            this.$modalText.value = $selectedNote.children[2].innerHTML;
            this.$modal.classList.add("open-modal");
        }
        else{
            return;
        }
    }

    closeModal(event){
        let isModalFormClickedOn = this.$modalForm.contains(event.target);
        let isModalCloseButtonClickedOn = this.$modalCloseButton.contains(event.target);
        if((!isModalFormClickedOn || isModalCloseButtonClickedOn) && this.$modal.classList.contains("open-modal")){
            this.editNote(this.selectedNoteId, {title: this.$modalTitle.value, text: this.$modalText.value});
            this.$modal.classList.remove("open-modal");
        }
        else{
            return;
        }
    }

    handleArchiving(event){
        let $selectedNote = event.target.closest(".note");
        if($selectedNote && event.target.closest(".archive")){
            this.selectedNoteId = $selectedNote.id;
            this.deleteNote(this.selectedNoteId);
        }
        else{
            return;
        }
    }

    handleToggleSideBarHover(){
        if(this.miniSidebar){
            this.$sidebar.style.width = "250px";
            this.$sidebar.classList.add("side-bar-hover");
            this.$sidebarActiveItem.classList.add("side-bar-active-items");
            this.miniSidebar = false;
        }

        else{
            this.$sidebar.style.width = "66px";
            this.$sidebar.classList.remove("side-bar-hover");
            this.$sidebarActiveItem.classList.remove("side-bar-active-items");
            this.miniSidebar = true;
        }
    }

    saveNotes(){
         localStorage.setItem(`notes`, JSON.stringify(this.notes));
    }
}

let app = new App();