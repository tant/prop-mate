"use client";

import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
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

export type PropertyCreateInput = z.infer<typeof propertyCreateSchema>;

interface PropertyFormProps {
  onSubmit: (data: PropertyCreateInput) => void;
  loading?: boolean;
  formRef?: (ref: HTMLFormElement | null) => void;
}

export function PropertyForm(props: PropertyFormProps) {
  const { onSubmit, formRef } = props;

  const form = useForm<PropertyCreateInput>({
    resolver: zodResolver(propertyCreateSchema) as Resolver<PropertyCreateInput>,
    defaultValues: {
      memorableName: "",
      propertyType: "HOUSE",
      listingType: "sale",
      status: "DRAFT",
      location: { fullAddress: "" },
      area: 0,
      price: { value: 0 },
      imageUrls: [],
      legalStatus: "PINK_BOOK",
    },
  });

  // Attach ref if provided
  const setFormRef = (el: HTMLFormElement | null) => {
    if (formRef) formRef(el);
  };

  return (
    <Form {...form}>
      <form
        ref={setFormRef}
        onSubmit={form.handleSubmit(onSubmit)}
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
          {/* Nút submit đã được chuyển lên header */}
        </div>
      </form>
    </Form>
  );
}

export function CreatePropertyFormWrapper() {
  const router = useRouter();
  const createProperty = api.property.create.useMutation({
    onSuccess: () => router.push("/properties"),
  });

  return (
    <PropertyForm
      onSubmit={(data) => createProperty.mutate(data)}
      loading={createProperty.isPending}
    />
  );
}
