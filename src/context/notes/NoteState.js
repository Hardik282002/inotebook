import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState=(props)=>{
    const host = "http://localhost:5000"
  const notesInitial=[]
  const [notes, setNotes]= useState(notesInitial)

  //Get all Notes
  const getNotes = async()=>{
    //API CALL
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET", 
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
        },
      });
      const json = await response.json();
      console.log(json);
      setNotes(json);
    }
     

  //Add a Note
  const addNote = async(title,description,tag)=>{
    //API CALL
    const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
        },
        body: JSON.stringify({title, description, tag}), 
      });
     const note = await response.json();
     setNotes(notes.concat(note));
    
  }
  //Delete a Note
  const deleteNote = async(id)=>{
    //API CALL
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE", 
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token') 
        },
      });
      const json= response.json();
      console.log(json);
      const newNotes = notes.filter((note)=>{return note._id!== id})
      setNotes(newNotes)
  }

  //Edit a note
  const editNote =async(id, title, description, tag)=>{
    
    //API CALL
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
        },
        body: JSON.stringify({title,description,tag}), 
      });
      const json = await response.json();
      console.log(json) 
  
    let newnotes = JSON.parse(JSON.stringify(notes))


    //LOGIC TO EDIT IN CLIENT
        for(let index=0; index<newnotes.length();index++){
            const element = newnotes[index];
            if(element._id=== id){
               newnotes[index].title=title;
               newnotes[index].description= description;
               newnotes[index].tag= tag;
               break;
            }
            
        }
        setNotes(newnotes);
}



   
   return(
    <NoteContext.Provider value={{notes,addNote, deleteNote,editNote,getNotes}}>
        {props.children}
    </NoteContext.Provider>
   )
   
}



export default NoteState;