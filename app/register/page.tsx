
"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        setForm({
          name: "",
          username: "",
          email: "",
          password: "",
        });
      }
    } catch {
      setMessage("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{
      maxWidth: 420,
      margin: "80px auto",
      padding: 30,
      border: "1px solid #ddd",
      borderRadius: 12,
      fontFamily: "Arial",
    }}>
      <h1>Daftar Akun</h1>
      <p>Buat akun baru</p>

      <form onSubmit={handleSubmit}>
        {(["name", "username", "email", "password"] as const).map(
          (field) => (
            <input
              key={field}
              type={
                field === "password" ? "password" :
                field === "email" ? "email" : "text"
              }
              placeholder={
                field === "name" ? "Nama Lengkap" :
                field === "username" ? "Username" :
                field === "email" ? "Email" : "Password (min. 8 karakter)"
              }
              value={form[field]}
              onChange={(e) =>
                setForm({ ...form, [field]: e.target.value })
              }
              required
              minLength={field === "password" ? 8 : undefined}
              style={{
                display: "block",
                width: "100%",
                padding: 12,
                marginTop: 15,
                border: "1px solid #ccc",
                borderRadius: 6,
                boxSizing: "border-box",
              }}
            />
          )
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            marginTop: 20,
            background: "#111827",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          {loading ? "Memproses..." : "Daftar"}
        </button>
      </form>

      {message && <p role="status">{message}</p>}
    </main>
  );
}
