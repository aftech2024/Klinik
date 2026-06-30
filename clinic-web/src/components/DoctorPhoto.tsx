'use client';
import { useState } from 'react';

export default function DoctorPhoto({
  photoUrl, name, className = '',
}: {
  photoUrl: string | null;
  name: string;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);

  if (photoUrl && !broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={name}
        onError={() => setBroken(true)}
        className={`w-full h-full object-cover object-top ${className}`}
      />
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center text-6xl">
      👨‍⚕️
    </div>
  );
}
