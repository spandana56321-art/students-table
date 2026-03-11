import React from "react";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", age: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const storedStudents = localStorage.getItem("students");
      if (storedStudents) {
        setStudents(JSON.parse(storedStudents));
      }
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!form.name || !form.email || !form.age) {
      alert("All fields are required");
      return false;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (editId) {
      const updatedStudents = students.map((student) =>
        student.id === editId
          ? { id: editId, ...form }
          : student
      );

      setStudents(updatedStudents);
      setEditId(null);
      setShowEditModal(false);
    } else {
      const newStudent = {
        id: Date.now(),
        ...form,
      };
      setStudents([...students, newStudent]);
    }
    setForm({ name: "", email: "", age: "" });
  };

  const handleEdit = (student) => {
    setForm({
      name: student.name,
      email: student.email,
      age: student.age,
    });
    setEditId(student.id);
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setStudents(students.filter((s) => s.id !== deleteId));
    setShowDeleteModal(false);
  };

 const downloadExcel = () => {
  const exportData = students.map((student) => ({
    Name: student.name,
    Age: student.age,
    Email: student.email
  }));
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

  if (loading) return <h3>Loading students...</h3>;
  return (
    <div className="container">
      <h2>Students Table</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="age"
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
        />
        <button type="submit">Add Student</button>
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
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.age}</td>
              <td className="actions">
                <button onClick={() => handleEdit(student)}>Edit</button>
                <button onClick={() => handleDelete(student.id)}>
                  Delete
                </button>
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
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            <input
              name="age"
              value={form.age}
              onChange={handleChange}
            />
            <div className="modal-buttons">
              <button onClick={handleSubmit}>Update</button>
              <button onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
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