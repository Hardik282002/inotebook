const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// ROUTE 1 get all the notes using get request "/api/notes/fetchallnotes"
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });

    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
});
// ROUTE 2 add notes using post request "/api/notes/addnotes"
router.post(
  "/addnotes",
  fetchuser,
  [
    body("title").isLength({ min: 3 }),
    body("description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savednote = await note.save();

      res.json(savednote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error");
    }
  }
);
// ROUTE 3 update notes using post request "/api/notes/updatenotes"
router.put("/updatenotes/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    //    create a new notebook object
    const newnote = {};
    if (title) {
      newnote.title = title;
    }
    if (description) {
      newnote.description = description;
    }
    if (tag) {
      newnote.tag = tag;
    }
    const routeid = req.params.id;
    let note = await Notes.findById(routeid);
    if (!note) {
      return res.status(404).send("not found");
    }

    if (note.user && note.user.toString() !== req.user.id) {
      return res.status(401).send("not allowed");
    }
    note = await Notes.findByIdAndUpdate(
      routeid,
      { $set: newnote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
});

// ROUTE 4 delete notes using post request "/api/notes/deletenotes"
router.delete("/deletenotes/:id", fetchuser, async (req, res) => {
  try {
    const routeid = req.params.id;
    // find the note to delete
    let note = await Notes.findById(routeid);
    if (!note) {
      return res.status(404).send("not found");
    }
    // allow deletion only if user own the note
    if (note.user && note.user.toString() !== req.user.id) {
      return res.status(401).send("not allowed");
    }
    note = await Notes.findByIdAndDelete(routeid, { new: true });
    res.send({ success: "note has been deleted", note: note });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
