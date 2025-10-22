import React from "react";


function Footer() {
  return (
    <footer className="bg-blue-900 text-white text-center p-6 mt-10">
      <div className="max-w-6xl mx-auto ">
        {/* Información básica */}
        <h3 className="text-lg font-semibold m-2">
          Pagina de Rehabilitación 
        </h3>
        <p className="text-sm m-4">
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
           <a href="/privacidad" className="hover:underline">
            Política de Privacidad
            </a>
        </div>

        
        {/* Información de contacto */}
        <p className="text-sm">
           
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
