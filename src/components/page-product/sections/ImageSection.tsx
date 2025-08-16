// src/components/page-product/sections/ImageSection.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { getStorageProxyUrl } from '@/lib/storage-proxy';

interface ImageSectionProps {
  data: {
    url?: string; // Đây là storage path
    caption?: string;
  };
}

export function ImageSection({ data }: ImageSectionProps) {
  if (!data || !data.url) return null;

  // Chuyển đổi storage path thành proxy URL
  const imageUrl = getStorageProxyUrl(data.url);

  return (
    <motion.div 
      className="border rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <motion.img 
        src={imageUrl} 
        alt={data.caption || "Image"} 
        className="w-full h-auto rounded-md"
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      />
      {data.caption && (
        <motion.p 
          className="mt-2 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {data.caption}
        </motion.p>
      )}
    </motion.div>
  );
}