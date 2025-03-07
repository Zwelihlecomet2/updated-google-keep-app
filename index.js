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
}

let noteOne = {
    title: "Title",
    text: "Text"
}

let updatedNote = {
    title: "Updated Title",
    text: "Updated Text"
}

let app = new App();
app.addNote(0, noteOne);
app.addNote(1, noteOne);
app.addNote(2, noteOne);
app.addNote(3, noteOne);

app.displayNote();

setTimeout(() => {
    app.editNote(3, updatedNote);
    app.displayNote();
}, 1000);

setTimeout(() => {
    app.deleteNote(2);
    app.displayNote();
}, 2000);
