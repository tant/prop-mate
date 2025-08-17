"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useParams } from "next/navigation"
import { api } from "@/app/_trpc/client"
import { useState, useEffect } from "react"
import type { ProductPage } from "@/types/product-page"
import { getProductPageTemplateById } from "@/constants/product-templates"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const productId = params.id;

  // Fetch dữ liệu trang sản phẩm
  const { data: productPage, isLoading, error } = api.productPage.getById.useQuery({ id: productId }, {
    enabled: !!productId,
  });

  // Mutation để cập nhật trang
  const updateProductPage = api.productPage.update.useMutation({
    onSuccess: () => {
      toast.success("Trang đã được cập nhật");
    },
    onError: (error) => {
      toast.error(`Lỗi khi cập nhật: ${error.message}`);
    }
  });

  const [formData, setFormData] = useState<Partial<ProductPage> | null>(null);

  // Khi dữ liệu productPage load xong, cập nhật formData
  useEffect(() => {
    if (productPage) {
      setFormData(productPage);
    }
  }, [productPage]);

  // Hàm xử lý khi thay đổi input
  const handleInputChange = (sectionId: string, fieldKey: string, value: string | string[]) => {
    if (!formData) return;
    
    setFormData({
      ...formData,
      content: {
        ...formData.content,
        [sectionId]: {
          ...(formData.content?.[sectionId] || {}),
          [fieldKey]: value
        }
      }
    });
  };

  // Hàm xử lý khi thay đổi title hoặc usp
  const handleMetaChange = (field: 'title' | 'usp', value: string) => {
    if (!formData) return;
    
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Hàm lưu bản nháp
  const handleSaveDraft = () => {
    if (!formData || !formData.id) return;
    
    // Gọi API update với status = 'draft'
    updateProductPage.mutate({
      id: formData.id,
      data: {
        ...formData,
        status: 'draft',
      }
    });
  };

  // Hàm publish
  const handlePublish = () => {
    if (!formData || !formData.id) return;
    
    // Gọi API update với status = 'published'
    updateProductPage.mutate({
      id: formData.id,
      data: {
        ...formData,
        status: 'published',
      }
    });
  };

  // Hàm unpublish
  const handleUnpublish = () => {
    if (!formData || !formData.id) return;
    
    // Gọi API update với status = 'draft'
    updateProductPage.mutate({
      id: formData.id,
      data: {
        ...formData,
        status: 'draft',
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div>Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
  <div className="text-destructive">Lỗi: {error.message}</div>
      </div>
    );
  }

  if (!productPage || !formData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div>Không tìm thấy trang sản phẩm</div>
      </div>
    );
  }

  const template = getProductPageTemplateById(productPage.templateId);
  if (!template) {
    return (
      <div className="flex items-center justify-center h-full">
        <div>Template không hợp lệ</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <h1 className="text-lg font-semibold">Chỉnh Sửa Trang Sản Phẩm</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">ID Trang: {params.id}</h2>
                <div className="space-x-2">
                  <Button asChild variant="outline">
                    <Link href="/property-pages">Quay lại</Link>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      if (productPage) {
                        const url = `${window.location.origin}/products/${productPage.slug}`;
                        navigator.clipboard.writeText(url).then(() => {
                          toast.success("Đã copy link vào clipboard");
                        }).catch(err => {
                          console.error('Lỗi khi copy link: ', err);
                          toast.error("Không thể copy link");
                        });
                      }
                    }}
                  >
                    Copy link
                  </Button>
                  <Button 
                    onClick={handleSaveDraft}
                    disabled={updateProductPage.isPending}
                  >
                    {updateProductPage.isPending ? 'Đang lưu...' : 'Lưu bản nháp'}
                  </Button>
                  {productPage.status !== 'published' ? (
                    <Button 
                      onClick={handlePublish}
                      disabled={updateProductPage.isPending}
                    >
                      Publish
                    </Button>
                  ) : (
                    <Button 
                      variant="secondary"
                      onClick={handleUnpublish}
                      disabled={updateProductPage.isPending}
                    >
                      Unpublish
                    </Button>
                  )}
                  <Button asChild variant="outline">
                    <Link href={`/products/${productPage.slug}`} target="_blank">
                      Preview
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-6 space-y-6">
                <div>
                  <Label htmlFor="title">Tiêu đề</Label>
                  <Input
                    id="title"
                    value={formData.title || ''}
                    onChange={(e) => handleMetaChange('title', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="usp">USP</Label>
                  <Input
                    id="usp"
                    value={formData.usp || ''}
                    onChange={(e) => handleMetaChange('usp', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label>Trạng thái</Label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                      productPage.status === 'published' 
                        ? 'bg-success/10 text-success' 
                        : productPage.status === 'draft' 
                          ? 'bg-warning/10 text-warning' 
                          : 'bg-muted text-foreground'
                    }`}>
                      {productPage.status === 'published' ? 'Đã xuất bản' : productPage.status === 'draft' ? 'Bản nháp' : 'Không công khai'}
                    </span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Nội dung các Section</h3>
                  <div className="space-y-6">
                    {template.sections.map((section) => (
                      <div key={section.id} className="border rounded-md p-4">
                        <h4 className="font-medium mb-3">{section.name}</h4>
                        <div className="space-y-4">
                          {section.fields.map((field) => {
                            const fieldValue = formData.content?.[section.id]?.[field.key];
                            
                            if (field.type === 'text') {
                              return (
                                <div key={field.key}>
                                  <Label htmlFor={`${section.id}-${field.key}`}>{field.label}</Label>
                                  <Textarea
                                    id={`${section.id}-${field.key}`}
                                    value={fieldValue || ''}
                                    onChange={(e) => handleInputChange(section.id, field.key, e.target.value)}
                                    className="mt-1"
                                  />
                                </div>
                              );
                            }
                            
                            if (field.type === 'string') {
                              return (
                                <div key={field.key}>
                                  <Label htmlFor={`${section.id}-${field.key}`}>{field.label}</Label>
                                  <Input
                                    id={`${section.id}-${field.key}`}
                                    value={fieldValue || ''}
                                    onChange={(e) => handleInputChange(section.id, field.key, e.target.value)}
                                    className="mt-1"
                                  />
                                </div>
                              );
                            }
                            
                            if (field.type === 'array') {
                              // Xử lý array field - ví dụ: danh sách tiện ích
                              const items = Array.isArray(fieldValue) ? fieldValue : [];
                            return (
                              <div key={field.key}>
                                <Label htmlFor={`${section.id}-${field.key}`}>{field.label}</Label>
                                <div className="mt-1 space-y-2">
                                  {items.map((item: string, index: number) => {
                                    // Use item value as key if unique, else fallback to item+index
                                    const key = typeof item === 'string' && item.length > 0 ? `${item}-${index}` : `item-${index}`;
                                    return (
                                      <div key={key} className="flex items-center gap-2">
                                        <Input
                                          value={item}
                                          onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[index] = e.target.value;
                                            handleInputChange(section.id, field.key, newItems);
                                          }}
                                        />
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            const newItems = items.filter((_: string, i: number) => i !== index);
                                            handleInputChange(section.id, field.key, newItems);
                                          }}
                                        >
                                          Xóa
                                        </Button>
                                      </div>
                                    );
                                  })}
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const newItems = [...items, ''];
                                      handleInputChange(section.id, field.key, newItems);
                                    }}
                                  >
                                    Thêm
                                  </Button>
                                </div>
                              </div>
                            );
                            }
                            
                            // Default case for other field types (image, etc.)
                            return (
                              <div key={field.key}>
                                <Label htmlFor={`${section.id}-${field.key}`}>{field.label}</Label>
                                <Input
                                  id={`${section.id}-${field.key}`}
                                  value={fieldValue || ''}
                                  onChange={(e) => handleInputChange(section.id, field.key, e.target.value)}
                                  className="mt-1"
                                  placeholder={`Nhập ${field.label.toLowerCase()}`}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}