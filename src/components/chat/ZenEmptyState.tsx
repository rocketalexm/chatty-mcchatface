'use client';

import React from 'react';

export const ZenEmptyState: React.FC = () => {
  return (
    <div className="flex h-full w-full items-center justify-center p-6 text-center">
      <div className="max-w-md zen-fade-in">
        <h1 className="text-2xl font-light text-foreground/60 tracking-tight">
          What can I help you with?
        </h1>
      </div>
    </div>
  );
};
