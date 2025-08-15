import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PRODUCT_PAGE_TEMPLATES, type ProductPageTemplate } from '@/constants/product-templates';
import Image from 'next/image';

interface TemplateSelectorProps {
  onSelectTemplate: (template: ProductPageTemplate) => void;
  selectedTemplateId?: string;
}

export function TemplateSelector({ onSelectTemplate, selectedTemplateId }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {PRODUCT_PAGE_TEMPLATES.map((template) => (
        <Card 
          key={template.id} 
          className={`cursor-pointer hover:shadow-md transition-shadow ${
            selectedTemplateId === template.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onSelectTemplate(template)}
        >
          <CardHeader>
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video bg-gray-200 rounded-md overflow-hidden">
              {/* Trong thực tế, bạn sẽ dùng Image component với src từ template.thumbnail */}
              {/* <Image src={template.thumbnail} alt={template.name} fill className="object-cover" /> */}
              <div className="flex items-center justify-center h-full text-gray-500">
                Thumbnail Preview ({template.id})
              </div>
            </div>
            <Button className="w-full mt-4" variant={selectedTemplateId === template.id ? "default" : "outline"}>
              {selectedTemplateId === template.id ? "Đã chọn" : "Chọn Template"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}