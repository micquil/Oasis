import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DeleteConfirm({ rowData, onClose, onSave }) {
  // Local state for form inputs
  const [formData, setFormData] = useState({
    name: "",
    invoiceNumber: "",
    amount: "",
    status: "",
  });

  // When rowData changes, update form state
  useEffect(() => {
    if (rowData) {
      setFormData({
        name: rowData.name || "",
        invoiceNumber: rowData.invoiceNumber || "",
        amount: rowData.amount || "",
        status: rowData.status || "",
      });
    }
  }, [rowData]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Create an updated record object
    const updatedRecord = {
      ...rowData,
      ...formData,
    };

    // Call the onSave callback if provided
    if (onSave) {
      onSave(updatedRecord);
    }
    // Close the dialog after saving
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit Payable</DialogTitle>
        <DialogDescription>
          Update the payable details and click save when done.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        {/* Invoice Number */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="invoiceNumber" className="text-right">
            Invoice #
          </Label>
          <Input
            id="invoiceNumber"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>

        {/* Name */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>

        {/* Amount */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="amount" className="text-right">
            Amount
          </Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>

        {/* Status */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">
            Status
          </Label>
          <Input
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" onClick={handleSave}>
          Save changes
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
