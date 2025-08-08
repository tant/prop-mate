"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertyCreateSchema } from "@/types/property.schema";
import type { z } from "zod";
import { Form } from "@/components/ui/form";
import { api } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
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
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, removeUndefined(v)])
    ) as T;
  }
  return obj;
}

export type PropertyCreateInput = z.infer<typeof propertyCreateSchema>;

interface PropertyFormProps {
  onSubmit: (data: PropertyCreateInput) => void;
  loading?: boolean;
  formRef?: (ref: HTMLFormElement | null) => void;
}

export function PropertyForm(props: PropertyFormProps) {
  const { onSubmit, formRef } = props;


  // Only set default for non-required fields or those with a true default
  const defaultValues: Partial<PropertyCreateInput> = React.useMemo(() => ({
    propertyType: "HOUSE",
    listingType: "sale",
    status: "DRAFT",
    legalStatus: "PINK_BOOK",
    imageUrls: [],
  }), []);

  const form = useForm<PropertyCreateInput>({
    resolver: zodResolver(propertyCreateSchema) as Resolver<PropertyCreateInput>,
    defaultValues: defaultValues as PropertyCreateInput,
  });

  React.useEffect(() => {
    // Debug: log validation errors on submit
    if (form.formState.isSubmitted) {
      // eslint-disable-next-line no-console
      console.debug('Form errors:', form.formState.errors);
    }
  }, [form.formState.isSubmitted, form.formState.errors]);

  // Attach ref if provided
  const setFormRef = React.useCallback((el: HTMLFormElement | null) => {
    if (formRef) formRef(el);
  }, [formRef]);

  // Shake animation for save button on error
  const [shake, setShake] = React.useState(false);

  // Scroll to first error field and shake button
  const handleError = React.useCallback((errors: Record<string, unknown>) => {
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

  return (
    <Form {...form}>
      <form
        ref={setFormRef}
        onSubmit={form.handleSubmit(onSubmit, handleError)}
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
              "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2" +
              (shake ? " animate-shake" : "")
            }
            disabled={props.loading}
          >
            {props.loading ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </form>
    </Form>
  );
}

export function CreatePropertyFormWrapper({ formRef }: { formRef?: (ref: HTMLFormElement | null) => void }) {
  const router = useRouter();
  const createProperty = api.property.create.useMutation({
    onSuccess: (data) => {
      console.debug('Property created successfully:', data);
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
