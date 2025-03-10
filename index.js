class Note{
    constructor(id, title, text){
        this.id = id;
        this.title = title;
        this.text = text;
    }
}

class App{
    constructor(notes){
        this.notes = [];

        this.$inactiveForm = document.querySelector(".inactive-form");
        this.$activeForm = document.querySelector(".active-form");
        this.$noteTitle = document.querySelector("#note-title");
        this.$noteText = document.querySelector("#note-text");
        this.$notes = document.querySelector(".notes");

        this.addEventListeners();
    }

    addNote({title, text}){
        if(this.$noteTitle.value !== "" && this.$noteText.value !== ""){
            let newNote = new Note(cuid(), title, text);
            this.notes = [...this.notes, newNote];
            this.displayNote();
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
    }

    deleteNote(id){
        this.notes = this.notes.filter((item) => item.id !== id);
    }

    displayNote(){
        this.$notes.innerHTML = this.notes.map((item) =>{
        return   `
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
                                <span class="material-symbols-outlined hover small-icons">image</span>
                                <span class="tooltip-text">Image</span>
                            </div>
                            <div class="tooltip">
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
}

let app = new App();

