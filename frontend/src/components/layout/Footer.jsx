import React from "react";
import { Facebook, Instagram } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-blue-900 text-white text-center p-6 mt-10">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Información básica */}
        <h3 className="text-lg font-semibold">
          Pagina de Rehabilitación 
        </h3>
        <p className="text-sm">
          Ejercicios para todas las personas
        </p>

        {/* Enlaces rápidos */}
        <div className="flex justify-center space-x-6">
          <a href="/sobre-nosotros" className="hover:underline">
            Nosotros
          </a>
          <a href="/servicios" className="hover:underline">
            Servicios
          </a>
          <a href="/contacto" className="hover:underline">
            Contacto
          </a>
        </div>

        {/* Redes sociales */}
        <div className="flex justify-center space-x-6 mt-4">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            <Facebook size={24} />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-400 transition-colors"
          >
            <Instagram size={24} />
          </a>
          
           
        </div>

        {/* Información de contacto */}
        <p className="text-sm mt-4">
           
            33 254222
         rehabilitacion@udg.mx
        </p>

        {/* Derechos de autor */}
        <p className="text-xs mt-4">
          © {new Date().getFullYear()} Pagina de Rehabilitación. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
