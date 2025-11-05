import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  List,
  ListItem
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

import menuData from "./menuSemaine.json";
import FrenchReadingQuiz from "./FrenchReadingQuiz";
import DicteeInteractive from "./dictee/DicteeComponent";
import HistoireSemaine from "./histoire/histoire"
const WeeklyOverview = () => (
  <Box sx={{ color: "white", textAlign: "center" }}>
    <Typography variant="h4" gutterBottom>
      📅 Travail de la semaine
    </Typography>
    <Divider sx={{ bgcolor: "white", my: 2 }} />
    <Box sx={{ textAlign: "left", px: { xs: 2, md: 6 } }}>
      <Typography variant="h6" sx={{ color: "#1b9476ff", mt: 2 }}>
        📖 Lecture et compréhension
      </Typography>
      <List dense>
        <ListItem>Lis les textes de la semaine.</ListItem>
        <ListItem>Réponds aux questions de compréhension.</ListItem>
        <ListItem>Raconte avec tes propres mots ce que tu as compris.</ListItem>
      </List>

      <Typography variant="h6" sx={{ color: "#1b9476ff", mt: 2 }}>
        🎧 Histoire à écouter
      </Typography>
      <List dense>
        <ListItem>Écoute les histoires proposées.</ListItem>
        <ListItem>Fais un petit résumé oral ou écrit.</ListItem>
      </List>

      <Typography variant="h6" sx={{ color: "#1b9476ff", mt: 2 }}>
        ✍️ Dictée
      </Typography>
      <List dense>
        <ListItem>Écoute la dictée de la semaine.</ListItem>
        <ListItem>Écris-la dans ton cahier et vérifie ton orthographe.</ListItem>
      </List>
    </Box>
  </Box>
);

const componentsMap = {
  FrenchReadingQuiz,
  DicteeInteractive,
  HistoireSemaine

};

const WeeklyNavigator4 = () => {
  const [selected, setSelected] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [CurrentComponent, setCurrentComponent] = useState(null);

  const handleClick = (section) => {
    setSelected(section);
    setSelectedChild(null);
    setCurrentComponent(null);
  };

  const handleChildClick = (child) => {
    setSelectedChild(child);
    if (child.component) {
      const Comp = componentsMap[child.component];
      if (Comp) setCurrentComponent(() => Comp);
    } else {
      setCurrentComponent(null);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "black" }}>
      {/* HEADER */}
      <Box sx={{ backgroundColor:   "#426043ff",color: "white", textAlign: "center", py: 3, mb: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          {menuData.title}
        </Typography>
      </Box>

      {/* BODY */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, flexGrow: 1, gap: 2, px: 2 ,backgroundColor:   "#426043ff"}}>
        {/* MENU GAUCHE */}
        <Paper sx={{ flex: { xs: "none", md: "0 0 250px" }, p: 2, borderRadius: 2, boxShadow: 3,  }}>
          <Typography variant="h6" textAlign="center" color="black">📚 Menu</Typography>
          <Divider sx={{ my: 1 }} />
          {menuData.sections.map((section) => (
            <Box key={section.id} sx={{ mb: 1 }}>
              <Button
                fullWidth
                variant={selected?.id === section.id && !selectedChild ? "contained" : "outlined"}
                onClick={() => handleClick(section)}
                sx={{
                  backgroundColor: selected?.id === section.id && !selectedChild ? "#111111" : "#000000", // très noir / presque noir
                  color: "white", // texte noir
                  borderColor: "#000000",
                  "&:hover": {
                    backgroundColor: "#222222", // hover un peu plus clair
                    borderColor: "#333333",
                  },
                }}
              >
                {section.label}
              </Button>



              {selected?.id === section.id &&
                section.children &&
                section.children.map((child) => (
                  <Button
                    key={child.id}
                    size="small"
                    sx={{ ml: 2, mt: 1 }}
                    fullWidth
                    variant={selectedChild?.id === child.id ? "contained" : "outlined"}
                    onClick={() => handleChildClick(child)}
                  >
                    {child.label}
                  </Button>
                ))}
            </Box>
          ))}
        </Paper>

        {/* CONTENU DROITE */}

        <Paper sx={{ flex: 1, borderRadius: 2, boxShadow: 3, p: 3, backgroundColor: "black", color: "white", overflowY: "auto", position: "relative" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedChild?.id || selected?.id || "overview"}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ marginTop: "1rem" }}
            >
              {!selected && (
                <Typography textAlign="center" color="white">
                  Sélectionne une activité dans le menu de gauche.
                </Typography>
              )}
              <WeeklyOverview />

              {CurrentComponent && <CurrentComponent />}
            </motion.div>
          </AnimatePresence>
        </Paper>
      </Box>
    </Box>
  );
};

export default WeeklyNavigator4;
