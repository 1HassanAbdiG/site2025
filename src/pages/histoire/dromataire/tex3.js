import React, { useState, useRef } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // ⬅️ ajouter ceci
import bookData from "./tex1.json";
import QuizComponent from "./QuizComponent";

import audioParagraph1 from "./1.mp3";
import audioParagraph2 from "./2.mp3";
import audioParagraph3 from "./3.mp3";

import image1 from "./dromadaire1.png";
import image2 from "./dromadaire2.png";
import image3 from "./dromadaire3.png";

const audioMap = {
  1: audioParagraph1,
  2: audioParagraph2,
  3: audioParagraph3,
};

const imageMap = {
  dromadaire1: image1,
  dromadaire2: image2,
  dromadaire3: image3,
};

const Histoire12 = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const audioRef = useRef(null);
  const navigate = useNavigate(); // ⬅️ hook pour naviguer

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const audio = new Audio(audioMap[bookData.sections[currentSection].audio]);
    audioRef.current = audio;
    audio.play();
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const nextSection = () => {
    stopAudio();
    if (currentSection < bookData.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const previousSection = () => {
    stopAudio();
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  // ✅ revient à la page précédente
  const returnToHistory = () => {
    stopAudio();
    navigate(-1); 
  };

  const section = bookData.sections[currentSection];

  return (
    <Box sx={{ padding: 4, minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Bouton retour */}
      <Button variant="contained" color="secondary" onClick={returnToHistory}>
        🔙 Retour
      </Button>

      <Typography variant="h4" align="center" color="primary" gutterBottom>
        {bookData.title} - 2ᵉ Année
      </Typography>

      {/* Image + texte */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "flex-start",
          backgroundColor: "#FFF8E1",
          borderRadius: 2,
          boxShadow: 4,
          padding: 3,
          marginTop: 3,
          gap: 3,
        }}
      >
        <Box
          component="img"
          src={imageMap[section.image]}
          alt="Illustration"
          sx={{
            width: { xs: "100%", md: "40%" },
            height: "auto",
            borderRadius: 2,
            boxShadow: 3,
          }}
        />
        <Box sx={{ width: { xs: "100%", md: "60%" } }}>
          <Typography
            variant="h3"
            color="secondary"
            gutterBottom
            sx={{ textAlign: "center" }}
          >
            {section.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "justify",
              fontSize: "25px",
              lineHeight: 1.8,
              "& b": { color: "#FF5722" },
              "& i": { color: "#4CAF50" },
            }}
          >
            {section.text.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </Typography>
        </Box>
      </Box>

      {/* Contrôles audio + navigation */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
          marginTop: 4,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="contained"
          color="warning"
          onClick={previousSection}
          disabled={currentSection === 0}
        >
          👈 Précédent
        </Button>
        <Button variant="contained" color="info" onClick={playAudio}>
          🎵 Écouter l'audio
        </Button>
        <Button variant="contained" color="error" onClick={stopAudio}>
          ✋ Arrêter
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={nextSection}
          disabled={currentSection === bookData.sections.length - 1}
        >
          👉 Suivant
        </Button>
      </Box>

      <QuizComponent />
    </Box>
  );
};

export default Histoire12;
