import React, { useState, useEffect } from "react";

export default function QuizForm() {
  const [nom, setNom] = useState("");
  const [score, setScore] = useState("");
  const [datas, setDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Chargement initial ultra-rapide
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://script.google.com/macros/s/AKfycbwIhwrEBsKeM9GzbfnxvlzD7LKVxyzTJrczInqXtJ5PeeJetCIY12HILzCnsQfnPuAh/exec?action=getData");
        const data = await res.json();
        setDatas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur de chargement :", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Soumission optimisée
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("https://script.google.com/macros/s/AKfycbwIhwrEBsKeM9GzbfnxvlzD7LKVxyzTJrczInqXtJ5PeeJetCIY12HILzCnsQfnPuAh/exec", {
        method: "POST",
         mode: "no-cors", // Ignore les erreurs CORS
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, score }),
      });
      setNom("");
      setScore("");
      // Rafraîchir les données en arrière-plan
      const res = await fetch("https://script.google.com/macros/s/AKfycbwIhwrEBsKeM9GzbfnxvlzD7LKVxyzTJrczInqXtJ5PeeJetCIY12HILzCnsQfnPuAh/exec?action=getData");
      const newData = await res.json();
      setDatas(Array.isArray(newData) ? newData : []);
    } catch (err) {
      console.error("Erreur d'envoi :", err);
    }
  };

  // Affichage optimisé
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <form onSubmit={handleSubmit} style={{ width: "200px", margin: "20px auto" }}>
        <input
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          style={{ marginBottom: "10px", padding: "8px", width: "100%" }}
        />
        <input
          type="number"
          placeholder="Score"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          required
          style={{ marginBottom: "10px", padding: "8px", width: "100%" }}
        />
        <button type="submit" style={{ padding: "8px" }}>Envoyer</button>
      </form>

      {isLoading ? (
        <div style={{ marginTop: "20px", textAlign: "center" }}>Chargement...</div>
      ) : (
        <div style={{ marginTop: "20px", width: "80%", overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Date</th>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Nom</th>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {datas.length > 0 ? (
                datas.map((row, index) => (
                  <tr key={index}>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{new Date(row.date).toLocaleString()}</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{row.nom}</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{row.score}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: "8px" }}>Aucune donnée</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
