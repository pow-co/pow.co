import React from "react";
import { useColorScheme } from "../v13_context/ColorSchemeContext";

const ColorSchemeSelector = () => {
  const { setColorScheme } = useColorScheme();

  return (
    <div>
      <p>Pick a color scheme: </p>
      <select onChange={(e) => setColorScheme(e.target.value)}>
        <option value="classic">Classic</option>
        <option value="chrome">Chrome</option>
        <option value="sunburst">Sunburst</option>
        <option value="retro">Retro</option>
        <option value="greenscreen">Terminal</option>
      </select>
    </div>
  );
};

export default ColorSchemeSelector;
