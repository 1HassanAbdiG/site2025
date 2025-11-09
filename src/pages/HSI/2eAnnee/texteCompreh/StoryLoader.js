import React from "react";
import StoryPlayer from "./StoryPlayer";

// 🔹 Précharger TOUS les contextes d’histoires connus
const storyContexts = {
  dromadaire: {
    audio: require.context("./dromadaire", false, /\.mp3$/),
    images: require.context("./dromadaire", false, /\.(png|jpg|jpeg|gif)$/),
  },
  UneOrangePourSolane: {
    audio: require.context("./UneOrangePourSolane", false, /\.mp3$/),
    images: require.context("./UneOrangePourSolane", false, /\.(png|jpg|jpeg|gif)$/),
  },
  // 👉 ajoute ici d’autres histoires au besoin
  UnElephantCaTrompe: {
  audio: require.context("./UnElephantCaTrompe", false, /\.mp3$/),
  images: require.context("./UnElephantCaTrompe", false, /\.(png|jpg|jpeg|gif)$/),
},
Eve_chevre: {
   audio: require.context("././Eve_chevre", false, /\.mp3$/),
    images: require.context("./Eve_chevre", false, /\.(png|jpg|jpeg|gif|mp3)$/),
  },
  // ex: lapin: { audio: require.context("./lapin", false, /\.mp3$/), images: require.context("./lapin", false, /\.(png|jpg)$/) }
};

const createStoryComponent = (storyJsonPath) => {
  // Extraire le nom du dossier (ex: "./UneOrangePourSolane/tex1.json" → "UneOrangePourSolane")
  const folder = storyJsonPath.split("/")[1];
  const context = storyContexts[folder];

  const StoryComponent = () => {
    // Sécurité : vérifier si le dossier existe
    if (!context) {
      return <div>Erreur : l’histoire “{folder}” n’est pas enregistrée.</div>;
    }

    // Charger le JSON de l’histoire
    const storyData = require(`${storyJsonPath}`);

    // Construire les maps audio et image
    const audioMap = {};
    context.audio.keys().forEach((key) => {
      const fileName = key.replace("./", "");
      audioMap[fileName] = context.audio(key);
    });

    const imageMap = {};
    context.images.keys().forEach((key) => {
      const fileName = key.replace("./", "");
      imageMap[fileName] = context.images(key);
    });

    return <StoryPlayer storyData={storyData} audioMap={audioMap} imageMap={imageMap} />;
  };

  return StoryComponent;
};

export default createStoryComponent;
