import React from "react";

const Navbar = ({ setPage, t }) => {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <button onClick={() => setPage("dashboard")}>{t("dashboard")}</button>
      <button onClick={() => setPage("material")}>{t("material")}</button>
      <button onClick={() => setPage("production")}>{t("production")}</button>
      <button onClick={() => setPage("delivery")}>{t("delivery")}</button>
    </div>
  );
};

export default Navbar;