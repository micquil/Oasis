import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dropdown } from "primereact/dropdown";

export function EditPayable({ rowData, onClose, onSave }) {
  // Local state for form inputs, including new date and dueDate fields
  const [formData, setFormData] = useState({
    name: "",
    invoiceNumber: "",
    amount: "",
    status: "Unpaid",
    date: "",
    dueDate: "",
    originalDate: "", // Keeps the original format for sending
    originalDueDate: "",
  });

  // Format date for display
  const formatDateDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    if (rowData) {
      const today = new Date();
      const dueDate = new Date(rowData.date || today);
      dueDate.setDate(dueDate.getDate() + 30);

      setFormData({
        name: rowData.name || "",
        invoiceNumber: rowData.invoiceNumber || "",
        amount: rowData.amount || "",
        status: "Unpaid",
        date: formatDateDisplay(rowData.date) || formatDateDisplay(today), // Display in words
        dueDate: formatDateDisplay(rowData.dueDate) || formatDateDisplay(dueDate),
        originalDate: rowData.date || today.toISOString().split("T")[0], // Retain original for saving
        originalDueDate: rowData.dueDate || dueDate.toISOString().split("T")[0],
      });
    }
  }, [rowData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const updatedRecord = {
      ...rowData,
      name: formData.name,
      invoiceNumber: formData.invoiceNumber,
      amount: parseFloat(formData.amount) || 0,
      status: formData.status,
      date: formData.originalDate, // Send the original format
      dueDate: formData.originalDueDate,
    };

    console.log(updatedRecord);

    if (onSave) {
      onSave(updatedRecord);
    }
    onClose();
  };

  return (
    <>
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

        {/* Date and Due Date Side by Side */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <Label htmlFor="date" className="mr-2">
              Date
            </Label>
            <Input
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="border-0"
              type="text"
              disabled
            />
          </div>
          <div className="flex items-center">
            <Label htmlFor="dueDate" className="mr-2">
              Due Date
            </Label>
            <Input
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="border-0 text-red-500"
              type="text"
              disabled
            />
          </div>
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
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="col-span-3 border rounded p-2 w-full"
          >
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" onClick={handleSave}>
          Save changes
        </Button>
      </DialogFooter>
    </>
  );
}
