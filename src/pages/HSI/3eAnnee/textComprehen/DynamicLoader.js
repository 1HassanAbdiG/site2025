import React, { Suspense } from "react";

export const loadComponent = (name) => {
  // 🔹 Seul dossier activities/
  const activitiesContext = require.context("./", false, /\.js$/);

  const loadModule = (context) =>
    new Promise((resolve, reject) => {
      try {
        const module = context(`./${name}.js`);
        resolve(module);
      } catch (err) {
        reject(err);
      }
    });

  let Component = null;

  if (activitiesContext.keys().includes(`./${name}.js`)) {
    Component = React.lazy(() => loadModule(activitiesContext));
  } else {
    Component = () => <div>Composant "{name}" introuvable dans activities/ !</div>;
  }

  return (props) => (
    <Suspense fallback={<div>Chargement...</div>}>
      <Component {...props} />
    </Suspense>
  );
};
