"use client";

import { useEffect, useState } from "react";

export const useAnimations = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fadeIn = {
    opacity: isVisible ? 1 : 0,
    transition: "opacity 0.6s ease-in-out",
  };

  const slideUp = {
    transform: isVisible ? "translateY(0)" : "translateY(20px)",
    opacity: isVisible ? 1 : 0,
    transition: "all 0.6s ease-out",
  };

  const slideDown = {
    transform: isVisible ? "translateY(0)" : "translateY(-20px)",
    opacity: isVisible ? 1 : 0,
    transition: "all 2s ease-out",
  };

  const slideLeft = {
    transform: isVisible ? "translateX(0)" : "translateX(20px)",
    opacity: isVisible ? 1 : 0,
    transition: "all 2s ease-out",
  };

  const slideRight = {
    transform: isVisible ? "translateX(0)" : "translateX(-20px)",
    opacity: isVisible ? 1 : 0,
    transition: "all 2s ease-out",
  };

  const scale = {
    transform: isVisible ? "scale(1)" : "scale(0.9)",
    opacity: isVisible ? 1 : 0,
    transition: "all 0.6s ease-out",
  };

  const bounce = {
    animation: isVisible ? "bounce 1s ease-in-out" : "none",
  };

  return {
    isVisible,
    fadeIn,
    slideUp,
    slideDown,
    slideLeft,
    slideRight,
    scale,
    bounce,
  };
};

export const useStaggeredAnimation = (itemCount, delay = 100) => {
  const [visibleItems, setVisibleItems] = useState(new Set());

  useEffect(() => {
    const timeouts = [];

    for (let i = 0; i < itemCount; i++) {
      const timeout = setTimeout(() => {
        setVisibleItems((prev) => new Set([...prev, i]));
      }, i * delay);

      timeouts.push(timeout);
    }

    return () => {
      if (Array.isArray(timeouts)) {
        timeouts.forEach(clearTimeout);
      }
    };
  }, [itemCount, delay]);

  const getItemStyle = (index) => ({
    opacity: visibleItems.has(index) ? 1 : 0,
    transform: visibleItems.has(index) ? "translateY(0)" : "translateY(20px)",
    transition: "all 0.6s ease-out",
  });

  return { getItemStyle, visibleItems };
};

export const useHoverAnimation = () => {
  const [isHovered, setIsHovered] = useState(false);

  const hoverProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };

  const hoverStyle = {
    transform: isHovered ? "scale(1.05)" : "scale(1)",
    transition: "transform 0.2s ease-in-out",
  };

  return { isHovered, hoverProps, hoverStyle };
};
