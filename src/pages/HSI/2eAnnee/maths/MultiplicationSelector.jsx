import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { blue, green, orange } from "@mui/material/colors";

// Import des 3 composants
import Multiplication10 from "./mutlication10";
import Multiplication12 from "./mutlication12";
import Multiplication15 from "./mutlication15";

export default function MultiplicationSelector() {
    const [selectedGame, setSelectedGame] = useState(null);
    const [lang, setLang] = useState("fr"); // langue par défaut

    // dictionnaire des textes
    const texts = {
        fr: {
            title: "Choisis la plage de multiplication",
            range_1: "1 à 10",
            range_2: "1 à 12",
            range_3: "1 à 15",
        },
        en: {
            title: "Choose multiplication range",
            range_1: "1 to 10",
            range_2: "1 to 12",
            range_3: "1 to 15",
        },
    };

    const t = texts[lang];

    const renderGame = () => {
        switch (selectedGame) {
            case "1-10":
                return <Multiplication10 lang={lang} />;
            case "1-12":
                return <Multiplication12 lang={lang} />;
            case "1-15":
                return <Multiplication15 lang={lang} />;
            default:
                return null;
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", p: 3, background: "#f0f7ff"  ,}}>
            {/* Switch langue */}
            <Button
                variant="contained"
                onClick={() => setLang(lang === "fr" ? "en" : "fr")}
                sx={{ mb: 3, background: "#ffffffaa", color: "#333", fontWeight: "bold" }}
            >
                {lang === "fr" ? "English" : "Français"}
            </Button>

            {/* Titre */}
            <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: "bold", color: "#0c1f2a" }}>
                {t.title}
            </Typography>

            {/* Boutons pour choisir la plage */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mb: 5, flexWrap: "wrap" }}>
                <Button
                    onClick={() => setSelectedGame("1-10")}
                    sx={{
                        backgroundColor: blue[500],
                        color: "white",
                        fontWeight: "bold",
                        width: 150,
                        height: 60,
                        fontSize: 18,
                        "&:hover": { backgroundColor: blue[700] },
                        borderRadius: 3,
                    }}
                >
                    {t.range_1}
                </Button>

                <Button
                    onClick={() => setSelectedGame("1-12")}
                    sx={{
                        backgroundColor: green[500],
                        color: "white",
                        fontWeight: "bold",
                        width: 150,
                        height: 60,
                        fontSize: 18,
                        "&:hover": { backgroundColor: green[700] },
                        borderRadius: 3,
                    }}
                >
                    {t.range_2}
                </Button>

                <Button
                    onClick={() => setSelectedGame("1-15")}
                    sx={{
                        backgroundColor: orange[500],
                        color: "white",
                        fontWeight: "bold",
                        width: 150,
                        height: 60,
                        fontSize: 18,
                        "&:hover": { backgroundColor: orange[700] },
                        borderRadius: 3,
                    }}
                >
                    {t.range_3}
                </Button>
            </Box>

            {/* Affichage du jeu sélectionné */}
            <Box sx={{ mt: 4 }}>{renderGame()}</Box>
        </Box>
    );
}
