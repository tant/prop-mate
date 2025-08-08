import type { UseFormReturn } from "react-hook-form";
import type { PropertyCreateInput } from "./property-form";
import { PropertyFormLocation } from "./property-form-location";
import { PropertyFormCard } from "./property-form-card";

interface PropertyCardLocationProps {
  form: UseFormReturn<PropertyCreateInput>;
}

export function PropertyCardLocation({ form }: PropertyCardLocationProps) {
  return (
    <PropertyFormCard title="Vị trí">
      <PropertyFormLocation form={form} />
    </PropertyFormCard>
  );
}
