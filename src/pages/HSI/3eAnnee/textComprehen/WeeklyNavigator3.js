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
import QuizComponent from "./QuizComponent";
import createStoryComponent from "./StoryLoader";
import DicteeInteractive from "../dictee/DicteeComponent";
import HistoireSemaine from "../histoire/histoire";

const WeeklyOverview = () => (
  <Box sx={{ color: "white", textAlign: "center" }}>
    <Typography variant="h4" gutterBottom>
      📅 Travail de la semaine
    </Typography>
    <Divider sx={{ bgcolor: "white", my: 2 }} />
    <Box sx={{ textAlign: "left", px: { xs: 2, md: 6 } }}>
      <Typography variant="h6" sx={{ color: "#64b5f6", mt: 2 }}>
        📖 Lecture et compréhension
      </Typography>
      <List dense>
        <ListItem>Lis les textes de la semaine.</ListItem>
        <ListItem>Réponds aux questions de compréhension.</ListItem>
        <ListItem>Raconte avec tes propres mots ce que tu as compris.</ListItem>
      </List>

      <Typography variant="h6" sx={{ color: "#64b5f6", mt: 2 }}>
        🎧 Histoire à écouter
      </Typography>
      <List dense>
        <ListItem>Écoute les histoires proposées.</ListItem>
        <ListItem>Fais un petit résumé oral ou écrit.</ListItem>
      </List>

      <Typography variant="h6" sx={{ color: "#64b5f6", mt: 2 }}>
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
  DicteeInteractive: DicteeInteractive,
  HistoireSemaine: HistoireSemaine,
};

const WeeklyNavigator3 = () => {
  const [selected, setSelected] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [CurrentStory, setCurrentStory] = useState(null);
  const [quizPath, setQuizPath] = useState(null);

  const handleClick = (section) => {
    setSelected(section);
    setSelectedChild(null);
    setCurrentStory(null);
    setQuizPath(null);
  };

  const handleChildClick = (child) => {
    setSelectedChild(child);
    if (child.component) {
      const Comp = componentsMap[child.component];
      if (Comp) setCurrentStory(() => Comp);
    } else if (child.componentJson) {
      const StoryComp = createStoryComponent(child.componentJson);
      setCurrentStory(() => StoryComp);
    } else {
      setCurrentStory(null);
    }
    setQuizPath(child.quizJsonPath || null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          backgroundColor: "#1565c0",
          color: "white",
          textAlign: "center",
          py: 3,
          mb: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          {menuData.title}
        </Typography>
      </Box>

      {/* BODY */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          flexGrow: 1,
          gap: 2,
          px: 2,
        }}
      >
        {/* MENU GAUCHE */}
        <Paper
          sx={{
            flex: { xs: "none", md: "0 0 250px" },
            p: 2,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "black",
          }}
        >
          <Typography variant="h6" textAlign="center" color="primary">
            📚 Menu
          </Typography>
          <Divider sx={{ my: 1 }} />
          {menuData.sections.map((section) => (
            <Box key={section.id} sx={{ mb: 1 }}>
              <Button
                fullWidth
                variant={
                  selected?.id === section.id && !selectedChild
                    ? "contained"
                    : "outlined"
                }
                onClick={() => handleClick(section)}
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
                    variant={
                      selectedChild?.id === child.id
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() => handleChildClick(child)}
                  >
                    {child.label}
                  </Button>
                ))}
            </Box>
          ))}
        </Paper>

        {/* CONTENU DROITE FIXE */}
        <Paper
          sx={{
            flex: 1,
            borderRadius: 2,
            boxShadow: 3,
            p: 3,
            backgroundColor: "black",
            color: "white",
            overflowY: "auto",
            position: "relative",
          }}
        >
          <WeeklyOverview />

          {/* ✅ Transition fluide du contenu dynamique */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedChild?.id || selected?.id || "overview"}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ marginTop: "2rem" }}
            >
              {selected && (
                <>
                  <Divider sx={{ my: 2, bgcolor: "#1565c0" }} />
                  <Typography
                    variant="h5"
                    sx={{ mb: 2, color: "#90caf9", textAlign: "center" }}
                  >
                    {selected.label}
                  </Typography>

                  {CurrentStory ? (
                    <CurrentStory />
                  ) : (
                    <Typography
                      color="text.secondary"
                      sx={{ textAlign: "center", mt: 3 }}
                    >
                      {selectedChild
                        ? "Chargement du contenu..."
                        : "Sélectionne une activité dans le menu de gauche."}
                    </Typography>
                  )}

                  {quizPath && (
                    <Box
                      sx={{
                        borderTop: "2px solid #1565c0",
                        mt: 3,
                        pt: 3,
                      }}
                    >
                      <QuizComponent
                        quizJsonPath={quizPath}
                        quizTitle={selectedChild ? selectedChild.label : "Quiz"}
                      />
                    </Box>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </Paper>
      </Box>
    </Box>
  );
};

export default WeeklyNavigator3;
