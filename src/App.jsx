import { useState, useEffect } from "react";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

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
    e.preventDefault();

    if (!name || !email || !age) {
      alert("All fields required");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      alert("Invalid email");
      return;
    }

    if (editId) {
      setStudents(
        students.map((s) =>
          s.id === editId ? { id: editId, name, email, age } : s
        )
      );
      setEditId(null);
    } else {
      setStudents([
        ...students,
        { id: Date.now(), name, email, age }
      ]);
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
  };

  const handleDelete = (id) => {
    if (confirm("Delete student?")) {
      setStudents(students.filter((s) => s.id !== id));
    }
  };

  if (loading) return <h3>Loading...</h3>;

  return (
    <div style={{ padding: "20px" }}>
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

      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
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

              <td>
                <button onClick={() => handleEdit(s)}>Edit</button>
                <button onClick={() => handleDelete(s.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;