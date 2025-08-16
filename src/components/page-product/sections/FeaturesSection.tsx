// src/components/page-product/sections/FeaturesSection.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FeaturesSectionProps {
  data: {
    items?: string[];
  };
}

export function FeaturesSection({ data }: FeaturesSectionProps) {
  if (!data || !data.items || data.items.length === 0) return null;

  return (
    <motion.div 
      className="border rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <motion.h2 
        className="text-2xl font-bold mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Tiện ích nổi bật
      </motion.h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.items.map((item, index) => (
          <motion.li 
            key={index} 
            className="flex items-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
          >
            <span className="mr-2 text-green-500">✓</span>
            <span>{item}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}