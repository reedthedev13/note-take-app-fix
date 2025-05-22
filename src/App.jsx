import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { PlusIcon, TrashIcon, SparklesIcon } from "@heroicons/react/24/outline";

export default function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const newNote = () => ({
    id: uuidv4(),
    title: "",
    content: "",
    lastModified: new Date().toISOString(),
  });

  const createNote = () => {
    const note = newNote();
    setNotes([note, ...notes]);
    setSelectedNote(note);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
    setSelectedNote(null);
  };

  const updateNote = (updatedNote) => {
    setNotes(
      notes.map((note) =>
        note.id === updatedNote.id
          ? { ...updatedNote, lastModified: new Date().toISOString() }
          : note
      )
    );

    setSelectedNote(updatedNote);
  };

  const handleTitleChange = (e) => {
    const updatedNote = { ...selectedNote, title: e.target.value };
    updateNote(updatedNote);
  };

  const handleContentChange = (e) => {
    const updatedNote = { ...selectedNote, content: e.target.value };
    updateNote(updatedNote);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex">
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={createNote}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 
                     shadow-md hover:shadow-lg transition-all"
          >
            <PlusIcon className="w-5 h-5" />
            New Note
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className={`group p-3 rounded-xl mb-2 cursor-pointer transition-all
                ${
                  selectedNote?.id === note.id
                    ? "bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent"
                }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium truncate text-gray-800 dark:text-gray-200">
                  {note.title}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 p-1 rounded-lg transition-opacity"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                {note.content.replace(/<[^>]+>/g, "") || "Empty note..."}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                {new Date(note.lastModified).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 p-8">
        {selectedNote ? (
          <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-8">
              <input
                type="text"
                value={selectedNote.title}
                onChange={(e) =>
                  updateNote({ ...selectedNote, title: e.target.value })
                }
                className="text-3xl font-bold bg-transparent text-gray-800 dark:text-gray-200
                          placeholder-gray-400 focus:outline-none w-full"
                placeholder="Note Title"
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={() => deleteNote(selectedNote.id)}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                >
                  <TrashIcon className="w-6 h-6 text-red-500" />
                </button>
              </div>
            </div>

            <textarea
              value={selectedNote.content}
              onChange={(e) =>
                updateNote({ ...selectedNote, content: e.target.value })
              }
              className="w-full h-[calc(100vh-160px)] resize-none bg-transparent text-gray-700 dark:text-gray-300
                        focus:outline-none text-lg leading-relaxed placeholder-gray-400"
              placeholder="Start writing your thoughts..."
            />
          </div>
        ) : (
          <div className="text-center mt-20 space-y-4">
            <div className="inline-block p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <SparklesIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300">
                Your Digital Notebook
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
                Create notes, jot down ideas, and organize your thoughts in a
                clean and focused environment.
              </p>
              <button
                onClick={createNote}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl
                          flex items-center gap-2 mx-auto shadow-md hover:shadow-lg transition-all"
              >
                <PlusIcon className="w-5 h-5" />
                Create First Note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
