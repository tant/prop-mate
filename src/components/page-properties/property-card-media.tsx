import type { UseFormReturn } from "react-hook-form";
import type { PropertyCreateInput } from "./property-form";
import { PropertyFormMedia } from "./property-form-media";
import { PropertyFormCard } from "./property-form-card";

interface PropertyCardMediaProps {
  form: UseFormReturn<PropertyCreateInput>;
}

export function PropertyCardMedia({ form }: PropertyCardMediaProps) {
  return (
    <PropertyFormCard title="Hình ảnh & Tài liệu">
      <PropertyFormMedia form={form} />
    </PropertyFormCard>
  );
}
