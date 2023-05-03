import React, { useEffect, useState } from 'react';

export const loadingEmoji = ['🧠', '⛏️', '🦚', '🦌'];

function Loader() {
  const [emoji, setEmoji] = useState('');

  useEffect(() => {
    setEmoji(loadingEmoji[Math.floor(Math.random() * loadingEmoji.length)]);
  }, []);

  return (
    <div className="grid h-screen grid-cols-12 ">
        <div className="col-span-12 mx-auto animate-pulse text-4xl">
        {emoji}
        </div>
    </div>
  );
}

export default Loader;
