// src/components/page-product/sections/HeroSection.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { getStorageProxyUrl } from '@/lib/storage-proxy';

interface HeroSectionProps {
  data: {
    title?: string;
    subtitle?: string;
    image?: string; // Đây là storage path
  };
}

export function HeroSection({ data }: HeroSectionProps) {
  if (!data) return null;

  // Chuyển đổi storage path thành proxy URL
  const imageUrl = data.image ? getStorageProxyUrl(data.image) : null;

  return (
    <motion.div 
      className="relative bg-gray-200 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {imageUrl ? (
        <motion.img 
          src={imageUrl} 
          alt={data.title || "Hero image"} 
          className="w-full h-64 object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.7 }}
        />
      ) : (
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
        {data.title && (
          <motion.h1 
            className="text-3xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {data.title}
          </motion.h1>
        )}
        {data.subtitle && (
          <motion.p 
            className="mt-2 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {data.subtitle}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}