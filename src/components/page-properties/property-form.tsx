"use client";

import * as React from "react";
import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertyCreateSchema } from "@/types/property.schema";
import type { z } from "zod";
import { Form } from "@/components/ui/form";
import { api } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PropertyFormMedia } from "./property-form-media";
import { PropertyFormBasics } from "./property-form-basics";
import { PropertyFormContact } from "./property-form-contact";
import { PropertyFormLocation } from "./property-form-location";
import { PropertyFormDetails } from "./property-form-details";
import { PropertyFormMore } from "./property-form-more";
import { useCurrentUser } from "@/hooks/use-current-user";

// Utility: remove all undefined fields (deep)
function removeUndefined<T>(obj: T): T {
  if (Array.isArray(obj)) return obj.map(removeUndefined) as T;
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, removeUndefined(v)])
    ) as T;
  }
  return obj;
}

export type PropertyCreateInput = z.infer<typeof propertyCreateSchema>;

import type { Property } from "@/types/property";

interface PropertyFormProps {
  onSubmit: (data: PropertyCreateInput) => void;
  loading?: boolean;
  formRef?: React.Ref<HTMLFormElement>;
  initialValues?: Partial<Property>;
  mode?: "create" | "edit";
  disabled?: boolean;
}

export function PropertyForm(props: PropertyFormProps) {
  const { onSubmit, formRef, initialValues } = props;


  // Only set default for non-required fields or those with a true default
  const defaultValues: Partial<PropertyCreateInput> = React.useMemo(() => {
    if (initialValues) {
      // Map Property sang PropertyCreateInput (bỏ các field không có trong create schema)
      const rest = { ...initialValues };
      // Nếu có location, đảm bảo có đủ field
      if (rest.location && typeof rest.location === 'object') {
        rest.location = {
          city: rest.location.city || '',
          district: rest.location.district || '',
          ward: rest.location.ward || '',
          street: rest.location.street || '',
          fullAddress: rest.location.fullAddress || '',
          gps: rest.location.gps,
        };
      }
      return {
        memorableName: '',
        propertyType: 'HOUSE',
        listingType: 'sale',
        status: 'DRAFT',
        legalStatus: 'PINK_BOOK',
        imageUrls: [],
        ...rest,
      };
    }
    return {
      memorableName: '',
      propertyType: 'HOUSE',
      listingType: 'sale',
      status: 'DRAFT',
      legalStatus: 'PINK_BOOK',
      imageUrls: [],
    };
  }, [initialValues]);

  const form = useForm<PropertyCreateInput>({
    resolver: zodResolver(propertyCreateSchema) as Resolver<PropertyCreateInput>,
    defaultValues: defaultValues as PropertyCreateInput,
  });

  // Khi initialValues thay đổi (edit), reset lại form
  React.useEffect(() => {
    if (initialValues) {
      const rest = { ...initialValues };
      form.reset({
        memorableName: '',
        propertyType: 'HOUSE',
        listingType: 'sale',
        status: 'DRAFT',
        legalStatus: 'PINK_BOOK',
        imageUrls: [],
        ...rest,
      } as PropertyCreateInput);
    }
  }, [initialValues, form, form.reset]);

  React.useEffect(() => {
    // Debug: log validation errors on submit
    if (form.formState.isSubmitted) {
      console.debug('Form errors:', form.formState.errors);
    }
  }, [form.formState.isSubmitted, form.formState.errors, form]);


  // Shake animation for save button on error
  const [shake, setShake] = React.useState(false);

  // Scroll to first error field and shake button
  const handleError = React.useCallback((errors: Record<string, unknown>) => {
    console.warn('Form validation errors:', errors);
    const keys = Object.keys(errors);
    if (keys.length > 0) {
      const firstErrorKey = keys[0];
      const el = document.querySelector(`[data-slot="form-item"] [name="${firstErrorKey}"]`) || document.querySelector(`[name="${firstErrorKey}"]`);
      el?.scrollIntoView?.({ behavior: "smooth", block: "center" });
      if (el && typeof (el as HTMLElement).focus === 'function') {
        (el as HTMLElement).focus();
      }
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  }, []);

  // Dialog state
  const [showDialog, setShowDialog] = useState(false);
  // const router = useRouter(); // Unused

  // Kiểm tra có dữ liệu nhập dở dang không (trừ optionFields)
  const hasDirtyNonOption = React.useMemo(() => {
    const optionFields = [
      "propertyType", "listingType", "status", "legalStatus", "imageUrls"
    ];
    const dirty = form.formState.dirtyFields;
    return Object.keys(dirty).some((k) => !optionFields.includes(k));
  }, [form.formState.dirtyFields]);

  const handleCancel = () => {
    if (hasDirtyNonOption) {
      setShowDialog(true);
    } else {
      window.history.back();
    }
  };

  const handleDialogConfirm = () => {
    setShowDialog(false);
    window.history.back();
  };

  const handleDialogCancel = () => {
    setShowDialog(false);
  };

  // Remove the useEffect that was checking formRef as it's no longer needed

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={e => {
          console.log('form onSubmit event');
          form.handleSubmit(onSubmit, handleError)(e);
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Card 1: Thông tin cơ bản */}
        <PropertyFormBasics form={form} />
        {/* Card 2: Thông tin liên hệ */}
        <PropertyFormContact form={form} />
        {/* Card 3: Vị trí */}
        <PropertyFormLocation form={form} />
        {/* Card 4: Chi tiết nhà/đất */}
        <PropertyFormDetails form={form} />
        {/* Card 5: Bổ sung */}
        <PropertyFormMore form={form} />
        {/* Card 6: Hình ảnh & tài liệu */}
        <PropertyFormMedia form={form} />
        <div className="md:col-span-2 flex justify-end gap-2 mt-4">
          <button
            type="submit"
            className={
              "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2"+
              (shake ? " animate-shake" : "")
            }
            disabled={props.loading}
          >
            {props.loading ? 'Đang lưu...' : 'Lưu'}
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-muted text-gray-700 shadow-xs hover:bg-gray-200 h-9 px-4 py-2"
            onClick={handleCancel}
            disabled={props.loading}
          >
            Hủy
          </button>
        </div>
      </form>
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded shadow-lg p-6 min-w-[320px] max-w-[90vw]">
            <div className="mb-4 text-base font-medium">Bạn có chắc muốn hủy? Dữ liệu đang nhập sẽ bị mất.</div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded bg-muted text-gray-700 hover:bg-gray-200"
                onClick={handleDialogCancel}
              >
                Tiếp tục nhập
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded bg-destructive text-white hover:bg-destructive/90"
                onClick={handleDialogConfirm}
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </Form>
  );
}

export function CreatePropertyFormWrapper({ formRef }: { formRef?: React.Ref<HTMLFormElement> }) {
  const router = useRouter();
  const createProperty = api.property.create.useMutation({
    onSuccess: async (data) => {
      console.debug('Property created successfully:', data);
      toast.success("Tạo bất động sản thành công!");
      await new Promise((res) => setTimeout(res, 1000));
      router.push("/properties");
    },
    onError: (error) => {
      console.error('Property create error:', error);
      alert(error.message || "Lưu thất bại. Vui lòng thử lại hoặc đăng nhập lại.");
    },
  });
  const user = useCurrentUser();

  return (
    <PropertyForm
      onSubmit={(data) => {
        const agentId = user?.uid;
        if (!agentId) {
          alert("Bạn cần đăng nhập để tạo bất động sản.");
          return;
        }
        const cleaned = removeUndefined(data);
        console.debug('Submit property data:', cleaned);
        createProperty.mutate(cleaned);
      }}
      loading={createProperty.isPending}
      formRef={formRef}
    />
  );
}
