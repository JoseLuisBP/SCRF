import { Link } from "react-router-dom";
import "../styles/Home.css";

import CustomButton from "../components/common/Button";

export default function Home() {
  return (
    <div className="home-container">
      <section className="home-header">
        <h1>One day, you'll be cool</h1>
      </section>

      <section className="home-content">
        <p>Suena música de edit de tiktok</p>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <CustomButton variant="primary" size="small">Guardar</CustomButton>
          <CustomButton variant="secondary" size="medium">Cancelar</CustomButton>
          <CustomButton variant="disabled" size="large">Deshabilitado</CustomButton>
        </div>
      </section>
    </div>
  );
}
