'use client';
import { useEffect } from 'react';

//sploh ne sprašuj, mam same genialne ideje
const Hearts = () => {
  useEffect(() => {
    const container = document.querySelector('.hearts-container');

    //generiraj do 45 src
    for (let i = 0; i < 45; i++) {
      const heart = document.createElement('div');
      heart.classList.add('heart');
      heart.textContent = '❤️';

      //random velikost 
      const size = Math.random() * 20 + 10;
      heart.style.fontSize = `${size}px`;

      //random pozicija
      heart.style.top = `${Math.random() * 100}vh`;
      heart.style.left = `${Math.random() * 100}vw`;

      container.appendChild(heart);
    }
  }, []);

  return null;
};

export default Hearts;
