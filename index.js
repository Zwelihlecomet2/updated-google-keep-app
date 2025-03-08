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
        
        this.$activeForm = document.querySelector(".active-form");
        this.$inactiveForm = document.querySelector(".inactive-form");
        this.$noteTitle = document.querySelector("#note-title");
        this.$noteText = document.querySelector("#note-text");

        this.addEventListeners();
    }

    addNote(id, {title, text}){
        let newNote = new Note(id, title, text);
        this.notes = [...this.notes, newNote];
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
        this.notes.map((item) =>{
            console.log(`
                ID: ${item.id}
                Title: ${item.title}
                Text: ${item.text}`);
        });
    }

    addEventListeners(){
        document.body.addEventListener("click", (event) =>{
            this.handleFormClick(event);
        });
    }

    handleFormClick(event){
        let isInactiveFormClickedOn = this.$inactiveForm.contains(event.target);
        let isActiveFormClickedOn = this.$activeForm.contains(event.target);

        if(isInactiveFormClickedOn){
            this.openActiveForm();
        }
        else if(!isInactiveFormClickedOn  && !isActiveFormClickedOn){
            this.closeActiveForm();
        }
    }

    openActiveForm(){
        this.$inactiveForm.style.display = "none";
        this.$activeForm.style.display = "block";
        this.$noteText.focus();
    }

    closeActiveForm(){
        this.$inactiveForm.style.display = "block";
        this.$activeForm.style.display = "none";
    }
}

let app = new App();

