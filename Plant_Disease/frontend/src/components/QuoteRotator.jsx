import React, { useState, useEffect } from 'react'

const quotes = [
  "Happy leaf, happy life.",
  "You’re unbe-leaf-able!",
  "Don’t be a sap, be a tree.",
  "Saving the planet, one leaf at a time.",
  "Be-leaf in yourself.",
  "Tree-mendous things are coming your way.",
  "Don’t leaf me hanging.",
  "Stay rooted, grow strong.",
  "I leaf you.",
  "Photosynthesize your dreams.",
  "I’m a fungi — but you’re my best friend.",
  "Plant smiles, grow laughter, harvest love.",
  "I'm quite literally rooting for you.",
  "Don’t be shady — unless you’re a tree.",
  "No need to leaf early, the party just started."
]
const fadeDuration = 600;  // ms
const displayDuration = 120000;  
  

export default function QuoteRotator() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [animate, setAnimate] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(false); // fade out
  
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
        setAnimate(true); // fade in
      }, fadeDuration);
    }, displayDuration);
  
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @keyframes slideDownFadeIn {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .slide-down-fade-in {
          animation: slideDownFadeIn ${fadeDuration}ms ease forwards;
        }
        .fade-out {
          opacity: 0;
          transition: opacity ${fadeDuration}ms ease-out;
        }
        .quote {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 1.25rem;
          color: #2F855A; /* green-700 */
          min-height: 2rem;
          transition: opacity ${fadeDuration}ms ease, transform ${fadeDuration}ms ease;
        }
      `}</style>

      <div
        key={currentQuoteIndex}  // force React to remount span on quote change
        className={`quote ${animate ? 'slide-down-fade-in' : 'fade-out'}`}
      >
        {quotes[currentQuoteIndex]}
      </div>
    </>
  )
}
