// src/components/page-product/ProductPageRenderer.tsx
'use client';

// ...existing code...
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { type ProductPage } from '@/types/product-page';
import { getProductPageTemplateById } from '@/constants/product-templates';
import { HeroSection } from './sections/HeroSection';
import { FeaturesSection } from './sections/FeaturesSection';
import { DescriptionSection } from './sections/DescriptionSection';
import { ImageSection } from './sections/ImageSection';

interface ProductPageRendererProps {
  productPage: ProductPage;
}

// Component wrapper cho section với animation khi cuộn đến
const AnimatedSectionWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ref, inView] = useInView({
    triggerOnce: true, // Chỉ trigger một lần
    threshold: 0.1, // Trigger khi 10% section vào viewport
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
};

export function ProductPageRenderer({ productPage }: ProductPageRendererProps) {
  const template = getProductPageTemplateById(productPage.templateId);
  
  if (!template) {
    return <div>Template không hợp lệ</div>;
  }
      // Removed unused imports

  // Tạm thời hardcode mapping section type đến component
  // Trong tương lai, có thể dùng một object mapping hoặc registry pattern
  const renderSection = (sectionId: string) => {
    const sectionData = productPage.content[sectionId];
    const sectionDefinition = template.sections.find(s => s.id === sectionId);
    
    if (!sectionDefinition) return null;

    switch (sectionDefinition.type) {
      case 'hero':
        return <HeroSection key={sectionId} data={sectionData} />;
      case 'features':
        return <FeaturesSection key={sectionId} data={sectionData} />;
      case 'text':
        return <DescriptionSection key={sectionId} data={sectionData} />;
      case 'image':
        return <ImageSection key={sectionId} data={sectionData} />;
      default:
        return <div key={sectionId}>Section type không được hỗ trợ: {sectionDefinition.type}</div>;
    }
  };

  return (
    <div className="space-y-8">
      {template.sections.map(section => (
        <AnimatedSectionWrapper key={section.id}>
          {renderSection(section.id)}
        </AnimatedSectionWrapper>
      ))}
    </div>
  );
}