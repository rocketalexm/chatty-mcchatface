'use client';

import React from 'react';

export const ZenEmptyState: React.FC = () => {
  return (
    <div className="flex h-full w-full items-start justify-center p-6 pt-[15dvh] text-center">
      <div className="max-w-md zen-fade-in">
        <h1 className="text-apple-heading text-foreground/60 tracking-tight">
          What can I help you with?
        </h1>
      </div>
    </div>
  );
};
