"use client";

import { useState } from "react";

const AnimatedCard = ({
  children,
  className = "",
  hover = true,
  clickable = false,
  onClick = null,
  delay = 0,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (!clickable || !onClick) return;

    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);
    onClick();
  };

  const baseClasses =
    "bg-purple-50 rounded-lg shadow-md border border-gray-200 transition-all duration-300 ease-in-out";

  const hoverClasses = hover ? "hover:shadow-xl hover:-translate-y-1" : "";
  const clickableClasses = clickable ? "cursor-pointer active:scale-98" : "";

  const classes = `
    ${baseClasses}
    ${hoverClasses}
    ${clickableClasses}
    ${isClicked ? "scale-95" : ""}
    ${className}
  `;

  return (
    <div
      className={`animate-slide-up overflow-hidden ${classes}`}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      {...props}
    >
      {/* Glow effect on hover */}
      {hover && (
        <div
          className={`absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 transition-opacity duration-300 -z-10 blur-xl ${
            isHovered ? "opacity-20" : ""
          }`}
        ></div>
      )}

      {/* Card content */}
      <div className="relative z-10">{children}</div>

      {/* Shimmer effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transform -skew-x-12 transition-all duration-1000 ${
          isHovered ? "opacity-30 translate-x-full" : "-translate-x-full"
        }`}
      ></div>
    </div>
  );
};

export default AnimatedCard;
