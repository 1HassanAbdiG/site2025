import React from "react";
import { Box, Typography } from "@mui/material";

const HistoireSemaine = () => {
  return (
    <Box sx={{ textAlign: "center", color: "white", mt: 2 }}>
      <Typography variant="h4" sx={{ mb: 2, color: "#90caf9" }}>
        🎧 Histoire de la semaine
      </Typography>

      {/* ✅ Vidéo intégrée via iframe Google Drive */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
            
               <Box
                 sx={{
                   position: "relative",
                   paddingTop: "56.25%", // Ratio 16:9
                   width: "100%",
                   maxWidth: "100%",
                   overflow: "hidden",
                 }}
               >
                 <iframe
                   src="https://www.youtube.com/embed/_shZbjeremk?rel=0&modestbranding=1&controls=1&autoplay=0&showinfo=0"
                   title="YouTube video player"
                   frameBorder="0"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                   allowFullScreen
                   style={{
                     position: "absolute",
                     top: 0,
                     left: 0,
                     width: "100%",
                     height: "100%",
                     border: "0",
                   }}
                 ></iframe>
       
               </Box>
       
      </Box>

      <Typography variant="h6" sx={{ mt: 3 }}>
        📖 Écoute attentivement cette histoire, puis raconte-la à ton camarade !
      </Typography>
    </Box>
  );
};

export default HistoireSemaine;
