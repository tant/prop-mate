"use client";

import * as React from "react";
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
import { Button } from "@/components/ui/button";

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
  const router = useRouter();


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
    if (form.formState.isSubmitted) {
      // no-op: previously logged validation errors for debugging
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.formState.isSubmitted]);


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

  // Dialog state (tạm thời không dùng)
  // const [showDialog, setShowDialog] = useState(false);
  // const router = useRouter(); // Unused

  // Kiểm tra có dữ liệu nhập dở dang không (trừ optionFields)
  // const hasDirtyNonOption = React.useMemo(() => {
  //   const optionFields = [
  //     "propertyType", "listingType", "status", "legalStatus", "imageUrls"
  //   ];
  //   const dirty = form.formState.dirtyFields;
  //   return Object.keys(dirty).some((k) => !optionFields.includes(k));
  // }, [form.formState.dirtyFields]);

  const handleCancel = () => {
    // Không còn dialog xác nhận, chỉ thực hiện thoát edit mode ngay lập tức
    if (props.mode === "edit") {
      const sp = new URLSearchParams(window.location.search);
      sp.delete('editmode');
      const query = sp.toString();
      const url = query ? `${window.location.pathname}?${query}` : window.location.pathname;
      router.replace(url, { scroll: false });
      return;
    }
    if (props.mode === "create") {
      router.push("/properties");
    }
  };



  // Remove the useEffect that was checking formRef as it's no longer needed

  // Determine mode for child forms
  const childMode = props.disabled ? undefined : (props.mode || 'edit');
  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={e => {
          form.handleSubmit(onSubmit, handleError)(e);
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Card 1: Thông tin cơ bản */}
        <PropertyFormBasics form={form} editable={childMode === "edit" || childMode === "create"} />
        {/* Card 2: Thông tin liên hệ */}
        <PropertyFormContact form={form} editable={childMode === "edit" || childMode === "create"} />
        {/* Card 3: Vị trí */}
        <PropertyFormLocation form={form} editable={childMode === "edit" || childMode === "create"} />
        {/* Card 4: Chi tiết nhà/đất */}
        <PropertyFormDetails form={form} editable={childMode === "edit" || childMode === "create"} />
        {/* Card 5: Bổ sung */}
        <PropertyFormMore form={form} editable={childMode === "edit" || childMode === "create"} />
        {/* Card 6: Hình ảnh & tài liệu */}
        <PropertyFormMedia form={form} editable={childMode === "edit" || childMode === "create"} />
        {(childMode === "edit" || childMode === "create") && (
          <div className="md:col-span-2 flex justify-end gap-2 mt-4">
            <Button
              type="submit"
              className={shake ? "animate-shake" : undefined}
              disabled={props.loading}
            >
              {props.loading ? 'Đang lưu...' : 'Lưu'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={props.loading}
            >
              Huỷ
            </Button>
          </div>
        )}
      </form>

    </Form>
  );
}

export function CreatePropertyFormWrapper({ formRef }: { formRef?: React.Ref<HTMLFormElement> }) {
  const router = useRouter();
  const createProperty = api.property.create.useMutation({
  onSuccess: async () => {
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
  createProperty.mutate(cleaned);
      }}
      loading={createProperty.isPending}
      formRef={formRef}
      mode="create"
    />
  );
}
