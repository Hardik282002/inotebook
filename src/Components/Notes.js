import React,{useContext,useEffect,useRef,useState} from 'react'
import noteContext from '../context/notes/noteContext';
import AddNote from './AddNote';
import NoteItem from './NoteItem';
import { useNavigate } from 'react-router';

const Notes = (props) => {
    const context = useContext(noteContext)
    let navigate = useNavigate();
    const {notes,getNotes,editNote}=context;
    useEffect(() => {
      if(localStorage.getItem('token')){
        getNotes();
      }
      else{
        navigate("/login");
      }
    
     //eslint-disable-next-line
    }, [])
const ref= useRef(null)
const refClose = useRef(null)
const[note, setNote]= useState({id: "",etitle:"", edescription:"", etag:""})

const updateNote=(currentNote)=>{
    ref.current.click();
    setNote({id: currentNote._id,etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag})
}

const handleClick =(e)=>{
    editNote(note.id, note.etitle, note.edescription, note.etag);
    refClose.current.click() 
    e.preventDefault();
    props.showAlert("Updated successfully", "success");
    
}
const onChange =(e)=>{
    setNote({...note, [e.target.name]: e.target.value})

}

  return (
    <>
    <AddNote showAlert = {props.showAlert}/>

    
<button ref={ref} type="button" className="btn btn-primary d-none" data-toggle="modal" data-target="#exampleModal">
    Launch demo modal
</button>


<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close"></button>
</div>

<div className="modal-body">
  <form className='my-3'>
  <div className="mb-3">
    <label htmlFor="title" className="form-label">Title</label>
    <input type="text" className="form-control" id="etitle" name="etitle" value={note.etitle} onChange={onChange}/>
  </div>
  <div className="mb-3">
    <label htmlFor="description" className="form-label">Description</label>
    <input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={onChange}/>
  </div>
  <div className="mb-3">
    <label htmlFor="tag" className="form-label">Tag</label>
    <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange}/>
  </div>

  </form>
</div>
      <div className="modal-footer">
        <button ref={refClose} type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
        <button onClick={handleClick} type="button" className="btn btn-primary">Update Note</button>
      </div>
    </div>
  </div>
</div>
  <div className="row my-3">
    <h2>Your Notes</h2> 
    {notes.map((note)=>{
       return <NoteItem key={note._id} updateNote={updateNote} showAlert= {props.showAlert} note={note}/>
    })}
  </div>
  </>
  )
}

export default Notes