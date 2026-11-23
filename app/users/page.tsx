
"use client";

import { useCallback, useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
  });
  const [message, setMessage] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error();
      setUsers(await res.json());
    } catch {
      setMessage("Gagal mengambil data pengguna");
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  function startEdit(user: User) {
    setEditing(user.id);
    setForm({
      name: user.name,
      username: user.username,
      email: user.email,
    });
  }

  async function saveEdit() {
    if (editing === null) return;

    const res = await fetch(`/api/users/${editing}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setMessage(data.message ?? (res.ok ? "Akun berhasil diubah" : "Gagal"));

    if (res.ok) {
      setEditing(null);
      await loadUsers();
    }
  }

  async function deleteUser(id: number) {
    if (!confirm("Yakin ingin menghapus akun ini?")) return;

    const res = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) await loadUsers();
  }

  return (
    <main style={{
      maxWidth: 1000,
      margin: "50px auto",
      padding: 20,
      fontFamily: "Arial",
    }}>
      <h1>Daftar Akun Pengguna</h1>

      <a href="/register">+ Tambah Akun</a>

      {message && <p role="status">{message}</p>}

      <div style={{ overflowX: "auto", marginTop: 20 }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
        }}>
          <thead>
            <tr>
              {["ID", "Nama", "Username", "Email", "Aksi"].map(h => (
                <th key={h} style={{
                  borderBottom: "2px solid #ddd",
                  padding: 12,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td style={{ padding: 12 }}>{user.id}</td>
                <td style={{ padding: 12 }}>{user.name}</td>
                <td style={{ padding: 12 }}>{user.username}</td>
                <td style={{ padding: 12 }}>{user.email}</td>
                <td style={{ padding: 12 }}>
                  <button onClick={() => startEdit(user)}>
                    Edit
                  </button>{" "}
                  <button onClick={() => deleteUser(user.id)}>
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing !== null && (
        <section style={{
          marginTop: 30,
          padding: 20,
          border: "1px solid #ddd",
          borderRadius: 10,
        }}>
          <h2>Edit Akun #{editing}</h2>

          {(["name", "username", "email"] as const).map(field => (
            <input
              key={field}
              value={form[field]}
              onChange={e => setForm({
                ...form,
                [field]: e.target.value,
              })}
              placeholder={field}
              style={{
                display: "block",
                padding: 10,
                margin: "10px 0",
                width: "100%",
                maxWidth: 400,
              }}
            />
          ))}

          <button onClick={saveEdit}>Simpan</button>{" "}
          <button onClick={() => setEditing(null)}>Batal</button>
        </section>
      )}
    </main>
  );
}
