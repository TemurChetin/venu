"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface BillingCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function BillingCheckbox({
  checked,
  onCheckedChange,
}: BillingCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="is_billing"
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(!!checked)}
      />
      <Label
        htmlFor="is_billing"
        className="text-sm font-normal cursor-pointer"
      >
        To'lov manzili sifatida belgilash
      </Label>
    </div>
  );
}

