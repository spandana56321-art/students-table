import React from "react";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  const downloadExcel = () => {
    const exportData = students.map(({ id, ...rest }) => rest);

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream"
    });

    saveAs(blob, "students.xlsx");
  };

  useEffect(() => {
    setTimeout(() => {
      const stored = localStorage.getItem("students");
      if (stored) {
        setStudents(JSON.parse(stored));
      }
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!name || !email || !age) {
      alert("All fields are required");
      return;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      alert("Invalid email format");
      return;
    }
    if (editId) {
      setStudents(
        students.map((s) =>
          s.id === editId ? { id: editId, name, email, age } : s
        )
      );
      setEditId(null);
      setShowEditModal(false);
    } else {
      setStudents([...students, { id: Date.now(), name, email, age }]);
    }
    setName("");
    setEmail("");
    setAge("");
  };

  const handleEdit = (student) => {
    setName(student.name);
    setEmail(student.email);
    setAge(student.age);
    setEditId(student.id);
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setStudents(students.filter((s) => s.id !== deleteId));
    setDeleteId(null);
    setShowDeleteModal(false);
  };

  if (loading) return <h3>Loading...</h3>;

  return (
    <div className="container">
      <h2>Students Table</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <button type="submit">
          {editId ? "Update Student" : "Add Student"}
        </button>
      </form>
      <button className="download-btn" onClick={downloadExcel}>
        Download Excel
      </button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.age}</td>
              <td className="actions">
                <button onClick={() => handleEdit(s)}>Edit</button>
                <button onClick={() => handleDelete(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Student</h3>
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleSubmit}>Update</button>
              <button onClick={() => setShowEditModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this student?</p>
            <div className="modal-buttons">
              <button onClick={confirmDelete}>Yes, Delete</button>
              <button onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;