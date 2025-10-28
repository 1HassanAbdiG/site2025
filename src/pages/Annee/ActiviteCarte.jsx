import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Activites.module.css";

const ActiviteCarte = ({ titre, description, activites, color }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={styles.card} style={{ borderColor: color }}>
      <h2 style={{ color }}>{titre}</h2>
      <p>{description}</p>
      <button
        className={styles.button}
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? "Fermer" : "Voir"}
      </button>

      {showDetails && (
        <ul className={styles.details}>
          {activites.map((act, idx) => (
            <li key={idx}>
              <Link to={act.path} className={styles.link}>
                {act.titre} ({act.type})
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActiviteCarte;
