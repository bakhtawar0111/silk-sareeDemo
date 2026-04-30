import React from "react";

const LanguageSwitcher = ({ setLang }) => {
  return (
    <div>
      <button onClick={() => setLang("en")}>EN</button>
      <button onClick={() => setLang("hi")}>HI</button>
      <button onClick={() => setLang("mr")}>MR</button>
    </div>
  );
};

export default LanguageSwitcher;