import { useEffect, useState } from "react";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ url: "", code: "" });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [copied, setCopied] = useState(null);

  const backendBase = "https://urlshortner-v030.onrender.com";

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/links");
      const data = await res.json();
      setLinks(data);
    } catch (err) {
      console.error("Error fetching:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    if (!form.url.trim()) {
      setMessage("Please enter a valid URL");
      setSubmitting(false);
      return;
    }

    const body = { url: form.url, code: form.code || undefined };

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.status === 409) {
        setMessage("Short code already exists");
      } else if (!res.ok) {
        setMessage("Error creating link");
      } else {
        setMessage("Link created successfully");
        setForm({ url: "", code: "" });
        fetchLinks();
      }
    } catch (err) {
      setMessage("Something went wrong");
    }

    setSubmitting(false);
  };

  const deleteLink = async (code) => {
    if (!confirm("Delete this link?")) return;

    await fetch(`/api/links/${code}`, { method: "DELETE" });
    fetchLinks();
  };

  const handleCopy = async (code) => {
    const shortenUrl = `${backendBase}/${code}`;

    await navigator.clipboard.writeText(shortenUrl);

    setCopied(code);

    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="p-4 mb-6 bg-white shadow rounded grid gap-3 border border-gray-200"
      >
        <div>
          <label className="block font-medium">Long URL</label>
          <input
            type="text"
            className="border p-2 w-full rounded"
            placeholder="https://example.com"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-medium">Custom Code (optional)</label>
          <input
            type="text"
            className="border p-2 w-full rounded"
            placeholder="e.g., mydocs"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />
        </div>

        <button
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50 transition"
        >
          {submitting ? "Creating..." : "Create Short Link"}
        </button>

        {message && (
          <div className="text-sm text-red-500 font-medium">{message}</div>
        )}
      </form>

      {/* TABLE */}
      {loading ? (
        <div>Loading links...</div>
      ) : links.length === 0 ? (
        <div>No links found.</div>
      ) : (
        <table className="w-full border border-gray-300 rounded overflow-hidden shadow">
          <thead>
            <tr className="bg-gray-100 text-left border-b">
              <th className="p-3">Code</th>
              <th className="p-3">URL</th>
              <th className="p-3">Clicks</th>
              <th className="p-3">Last Clicked</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {links.map((link) => (
              <tr
                key={link.code}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3 font-medium text-blue-600 underline">
                  <a href={`/code/${link.code}`}>{link.code}</a>
                </td>

                <td className="p-3 truncate max-w-xs">
                  <a
                    href={link.url}
                    target="_blank"
                    className="text-blue-500 underline"
                  >
                    {link.url}
                  </a>
                </td>

                <td className="p-3">{link.clicks}</td>

                <td className="p-3">
                  {link.lastClicked
                    ? new Date(link.lastClicked).toLocaleString()
                    : "-"}
                </td>

                <td className="p-3 flex gap-2">
                  <button
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition"
                    onClick={() => handleCopy(link.code)}
                  >
                    {copied === link.code ? "Copied!" : "Copy"}
                  </button>

                  <button
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition"
                    onClick={() => deleteLink(link.code)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
