import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";


const StoryPlayer = ({ storyData, audioMap, imageMap }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  // 🔹 Met à jour l'audio à chaque section
  useEffect(() => {
    if (!storyData) return;

    // Arrêter audio précédent si existant
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const currentAudioFile = storyData.sections[currentSection].audio;
    if (currentAudioFile && audioMap[currentAudioFile]) {
      audioRef.current = new Audio(audioMap[currentAudioFile]);
    } else {
      audioRef.current = null;
    }

    // Arrêter audio quand le composant se démonte
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [currentSection, audioMap, storyData]);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((err) => console.log("Impossible de jouer l'audio :", err));
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const nextSection = () => {
    stopAudio();
    if (currentSection < storyData.sections.length - 1) setCurrentSection(currentSection + 1);
  };

  const previousSection = () => {
    stopAudio();
    if (currentSection > 0) setCurrentSection(currentSection - 1);
  };

  const returnToHistory = () => {
    stopAudio();
    navigate(-1);
  };

  const section = storyData.sections[currentSection];

  return (
    <Box sx={{ padding: 1, minHeight: "80vh", fontFamily: "Arial, sans-serif" }}>
      <Button variant="contained" color="secondary" onClick={returnToHistory}>
        🔙 Retour
      </Button>

      <Typography variant="h4" align="center" color="primary" gutterBottom>
        {storyData.title} - {storyData.grade || "N/A"}ᵉ Année
      </Typography>

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
          sx={{ width: { xs: "100%", md: "40%" }, height: "auto", borderRadius: 2, boxShadow: 3 }}
        />
        <Box sx={{ width: { xs: "100%", md: "60%" } }}>
          <Typography variant="h3" color="secondary" gutterBottom sx={{ textAlign: "center" }}>
            {section.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "justify",
              fontSize: "25px",
              lineHeight: 1.8,
              color:"black",
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

      <Box sx={{ display: "flex", justifyContent: "center", gap: 1, marginTop: 4, flexWrap: "wrap" }}>
        <Button variant="contained" color="warning" onClick={previousSection} disabled={currentSection === 0}>
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
          disabled={currentSection === storyData.sections.length - 1}
        >
          👉 Suivant
        </Button>
      </Box>

      
    </Box>
  );
};

export default StoryPlayer;
