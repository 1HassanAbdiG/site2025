import React, { useState } from "react";
import mauvaisGardien from "../data/mauvaisGardien.json";
import fourmiBourdon from "../data/fourmiBourdon.json";
// Ajouter les autres textes si besoin

import EvaluationViewer from "./EvaluationViewer";

const TEXTES = [
  { id: "mg", label: "Le Mauvais Gardien", data: mauvaisGardien },
  { id: "fb", label: "La Fourmi et le Bourdon", data: fourmiBourdon },
  // Ajouter ici d'autres textes
];

export default function LecteurTextes() {
  const [selected, setSelected] = useState(TEXTES[0]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* COLONNE GAUCHE */}
      <div
        style={{
          width: "250px",
          borderRight: "1px solid #ddd",
          padding: "15px",
          background: "#f7f7f7"
        }}
      >
        <h3>Textes disponibles</h3>
        {TEXTES.map((txt) => (
          <div
            key={txt.id}
            onClick={() => setSelected(txt)}
            style={{
              padding: "10px",
              marginBottom: "8px",
              cursor: "pointer",
              background: selected.id === txt.id ? "#dbeafe" : "white",
              borderRadius: "6px",
              border: "1px solid #e5e7eb"
            }}
          >
            {txt.label}
          </div>
        ))}
      </div>

      {/* COLONNE DROITE */}
      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        <EvaluationViewer data={selected.data} />
      </div>

    </div>
  );
}
