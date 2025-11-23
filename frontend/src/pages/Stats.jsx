import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Stats() {
  const { code } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`/api/links/${code}`);
      setLink(res.data);
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <p className="p-6">Loading stats...</p>;

  if (!link)
    return <p className="p-6 text-red-500 text-xl">404 — Link not found</p>;

  // Short URL (backend redirect)
  const shortUrl = `http://localhost:9000/${code}`;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Stats for "{code}"</h1>

      <div className="bg-white shadow p-5 rounded-lg border border-gray-200">

        <p className="mb-3">
          <strong>Short URL:</strong>{" "}
          <a
            href={shortUrl}
            target="_blank"
            className="text-green-600 underline"
          >
            {shortUrl}
          </a>
        </p>

        <p>
          <strong>Full URL:</strong>{" "}
          <a
            href={link.url}
            target="_blank"
            className="text-blue-600 underline"
          >
            {link.url}
          </a>
        </p>

        <p className="mt-3">
          <strong>Total Clicks:</strong> {link.clicks}
        </p>

        <p className="mt-3">
          <strong>Last Clicked:</strong>{" "}
          {link.lastClicked
            ? new Date(link.lastClicked).toLocaleString()
            : "Never"}
        </p>
      </div>

      <a
        href="/"
        className="inline-block mt-6 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Back to Dashboard
      </a>
    </div>
  );
}
