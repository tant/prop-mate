// src/components/page-product/sections/DescriptionSection.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DescriptionSectionProps {
  data: {
    content?: string;
  };
}

export function DescriptionSection({ data }: DescriptionSectionProps) {
  if (!data || !data.content) return null;

  return (
    <motion.div 
      className="border rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.h2 
        className="text-2xl font-bold mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Mô tả chi tiết
      </motion.h2>
      <motion.p 
        className="whitespace-pre-line"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {data.content}
      </motion.p>
    </motion.div>
  );
}