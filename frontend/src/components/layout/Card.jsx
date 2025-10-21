import React from "react";

const Card = ({ image, title, description, link }) => {
  return (
    <div className="max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
      <img
        className="w-full h-48 object-cover"
        src={image}
        alt={title}
      />
      <div className="p-5">
        <h2 className="text-2xl font-bold text-blue-800 mb-2">{title}</h2>
        <p className="text-gray-700 text-base mb-4">{description}</p>
        {link && (
          <a
            href={link}
            className="inline-block px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition"
          >
            Ver mas
          </a>
        )}
      </div>
    </div>
  );
};

export default Card;
