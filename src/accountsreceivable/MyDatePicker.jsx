import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { FormItem, FormMessage } from "@/components/ui/form";

export const MyDaTePicker = ({ field }) => {
  // Initialize local state with the field value or null if none
  const [selected, setSelected] = useState(field.value || null);

  return (
    <FormItem className="flex-1 ">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={(date) => {
          setSelected(date);
          // Update the form field with the selected date
          field.onChange(date);
        }}
      />
      <FormMessage />
    </FormItem>
  );
};
