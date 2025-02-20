import React from "react";
import Sidebar from "../sidebar/Sidebar.jsx";
import { apiServices1 } from "/src/services/apiServices.js";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MyDaTePicker } from "./MyDatePicker.jsx";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button as Button1 } from "primereact/button";
import "primereact/resources/themes/lara-light-blue/theme.css"; // Theme
import "primereact/resources/primereact.min.css"; // Core styles
import "primeicons/primeicons.css"; // Icons
import { EditReceivable } from "./_EditReceivable.jsx";
import { PayNow } from "./_PayNow.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toaster } from "react-hot-toast";
import { IconField } from "primereact/iconfield";
import { InputText } from "primereact/inputtext";
import { InputIcon } from "primereact/inputicon";
import { FilterMatchMode } from "primereact/api";

const AccountsReceivable = () => {
  const formatCurrency = (value) => {
    if (!value) return "";
    const number = parseFloat(value);
    if (isNaN(number)) return value; // Return as-is if invalid
    return new Intl.NumberFormat("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [displayEdit, setDisplayEdit] = useState(false);
  const [displayPayNow, setDisplayPayNow] = useState(false);
  const [displayDelete, setDisplayDelete] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyState, setLazyState] = useState({
    first: 0,
    rows: 15,
    page: 1,
    sortField: null,
    sortOrder: null,
    filters: {},
  });

  useEffect(() => {
    fetchData();
  }, [lazyState]); // Fetch data whenever lazyState changes

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        page: lazyState.page,
        rows: lazyState.rows,
        sortField: lazyState.sortField,
        sortOrder: lazyState.sortOrder,
        filters: lazyState.filters,
      };

      const response = await apiServices1.getAllReceivables(params);
      const sortedData = response.sort((a, b) => b.id - a.id); // Ensure your API supports pagination
      setAccounts(sortedData);
      setTotalRecords(response.totalRecords);
    } catch (error) {
      console.error("Failed to fetch accounts receivable:", error);
    } finally {
      setLoading(false);
    }
  };

  const onPage = (event) => {
    setLazyState((prev) => ({
      ...prev,
      first: event.first,
      rows: event.rows,
      page: event.page + 1, // PrimeReact pages are zero-based
    }));
  };

  const onSort = (event) => {
    setLazyState((prev) => ({
      ...prev,
      sortField: event.sortField,
      sortOrder: event.sortOrder,
    }));
  };

  const onFilter = (event) => {
    setLazyState((prev) => ({
      ...prev,
      filters: event.filters,
      first: 0, // Reset pagination when filtering
    }));
  };

  // const fetchData = async () => {
  //   try {
  //     const data = await apiServices1.getAllReceivables();
  //     const sortedData = data.sort((a, b) => b.id - a.id);
  //     setAccounts(sortedData);
  //   } catch (error) {
  //     console.error("Failed to fetch accounts receivable:", error);
  //   }
  // };

  useEffect(() => {
    fetchData();
  }, []);

  const totalPayable = accounts.reduce((sum, item) => sum + item.amount, 0);
  const unpaidPayables = accounts.filter(
    (item) => item.status === "Unpaid"
  ).length;

 const formSchema = z.object({
    customerName: z.string().min(1, "Customer name is required."),
    invoiceNumber: z.string().min(1, "Invoice number is required."),
    amount: z
      .string()
      .regex(/^\d+(,\d{3})*(\.\d{1,2})?$/, {
        message: "Invalid amount format (max 2 decimal places).",
      })
      .transform((val) => parseFloat(val.replace(/,/g, ""))), // Convert to number
    date: z.date(),
    status: z.enum(["Unpaid", "Paid"]),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      invoiceNumber: "",
      amount: "",
      status: "unpaid",
      date: new Date(),
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Ensure date is correctly formatted
      const formattedData = {
        ...data,
        name: data.customerName,
        amount: parseFloat(data.amount), // Ensure number type
        date: format(data.date, "yyyy-MM-dd"),
        dueDate: format(
          new Date(data.date).setDate(data.date.getDate() + 30),
          "yyyy-MM-dd"
        ),
      };

      const response = await apiServices1.createReceivable(formattedData);
      console.log("API Response:", response); // Debugging

      toast.success("Record added successfully!");
      fetchData();
      form.reset();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to add record!");
    } finally {
      setLoading(false);
    }
  };

  // Custom body template to display the date in words
  const dateBodyTemplate = (rowData) => {
    const dateObj = new Date(rowData.date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("en-US", { month: "long" }); // Full month name
    const year = dateObj.getFullYear();
    const ordinalDay = day;

    return `${month} ${ordinalDay}, ${year}`;
  };

  const duedateBodyTemplate = (rowData) => {
    const dateObj = new Date(rowData.dueDate);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("en-US", { month: "long" }); // Full month name
    const year = dateObj.getFullYear();
    const ordinalDay = day;

    return `${month} ${ordinalDay}, ${year}`;
  };

  // Custom template for the Status column (colors based on status)
  const statusTemplate = (rowData) => {
    return (
      <span
        style={{
          color: rowData.status.toLowerCase() === "unpaid" ? "red" : "green",
          fontWeight: "bold",
        }}
      >
        {rowData.status}
      </span>
    );
  };

  // Custom template for the Actions column
  const actionTemplate = (rowData) => {
    return (
      <React.Fragment>
        <div className="flex gap-2">
          <Button1
            icon="pi pi-dollar"
            className="p-button-success p-button-sm bg-green-100"
            onClick={() => handlePayNow(rowData)}
          />
          <Button1
            icon="pi pi-pencil"
            className="p-button-danger p-button-sm bg-blue-100"
            onClick={() => handleUpdate(rowData)}
          />
          <Button1
            icon="pi pi-trash"
            className="p-button-danger p-button-sm bg-red-100"
            rounded
            outlined
            onClick={() => handleDelete(rowData)}
          />
        </div>
      </React.Fragment>
    );
  };

  const handlePayNow = (rowData) => {
    console.log("Pay Now clicked:", rowData);
    setSelectedRow(rowData);
    setDisplayPayNow(true);
  };

  const handleUpdate = (rowData) => {
    console.log("Update clicked:", rowData);
    setSelectedRow(rowData);
    setDisplayEdit(true);
  };

  const handleDelete = (rowData) => {
    console.log("Delete clicked:", rowData);
    setSelectedRow(rowData);
    setDisplayDelete(true);
  };

  const handleFunction = async (action, updatedRecord) => {
    try {
      setLoading(true);

      if (!updatedRecord) {
        throw new Error("Invalid data provided");
      }

      if (action === "edit") {
        // Format data for updating
        const formattedData = {
          ...updatedRecord,
          name: updatedRecord.name || "",
          amount: parseFloat(updatedRecord.amount) || 0,
          date: format(new Date(updatedRecord.date), "yyyy-MM-dd"),
          dueDate: format(
            new Date(updatedRecord.date).setDate(
              new Date(updatedRecord.date).getDate() + 30
            ),
            "yyyy-MM-dd"
          ),
        };

        await apiServices1.updateReceivable(updatedRecord.id, formattedData);
        toast.success("Record updated successfully!");
      } else if (action === "pay") {
        // Implement payment logic (e.g., redirect to payment gateway)
        await apiServices1.paynowReceivable(
          updatedRecord.referenceId,
          updatedRecord
        );
        toast.success("Payment initiated successfully!");
      } else if (action === "delete") {
        await apiServices1.deleteReceivable(updatedRecord.id);
        toast.success("Record deleted successfully!");
      }

      fetchData(); // Refresh data after successful operation
      form.reset();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(`Failed to ${action} record!`);
    } finally {
      setLoading(false);
    }
  };

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    invoiceNumber: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    amount: { value: null, matchMode: FilterMatchMode.EQUALS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <IconField iconPosition="right" className="border rounded-xl p-2">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </IconField>
      </div>
    );
  };
  const header = renderHeader();

  const amountBodyTemplate = (rowData) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(rowData.amount);
  };

  return (
    <>
      <div className="flex min-h-screen">
        {/* Main content, dynamically resizes */}
        <div className="flex-1 min-w-0 px-24 bg-[#FAFBFF]">
          <h1 className="text-2xl font-bold mb-4 mt-6 text-blue-400">
            ACCOUNTS RECEIVABLE
          </h1>

          {/* Summary Cards */}
          <div className="flex justify-center mb-8">
            <div className="flex min-w-min bg-white rounded-xl">
              <div className="flex-col self-center mb-6 mr-12">
                <div className="p-6 m-6">
                  <h2 className="text-lg font-semibold">Total Receivable</h2>
                  <p className="text-2xl font-bold">
                    ₱{totalPayable.toLocaleString()}
                  </p>
                  <span className="text-red-500">UNPAID</span>
                </div>
                <div className="border-b mx-8" />
                <div className="p-6 m-6">
                  <h2 className="text-lg font-semibold">Unpaid Receivables</h2>
                  <p className="text-2xl font-bold">{unpaidPayables}</p>
                </div>
              </div>

              <div className="p-12 rounded-lg">
                <h2 className="text-2xl font-bold mb-6">
                  Add Record to Receivables
                </h2>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    {/* Customer Name */}
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter customer name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Invoice Number */}
                    <FormField
                      control={form.control}
                      name="invoiceNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Invoice #</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter invoice number"
                              onInput={(e) =>
                                (e.target.value = e.target.value.replace(
                                  /\D/g,
                                  ""
                                ))
                              } // Remove non-numeric characters
                              min="0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Amount */}
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (PHP)</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter amount"
                              className="rounded-xl"
                              value={field.value}
                              onChange={(e) => {
                                // Remove commas from the input first
                                let rawValue = e.target.value.replace(/,/g, "");
                                // Allow only valid numbers (including decimals) with up to 2 decimal places
                                if (
                                  /^\d*\.?\d{0,2}$/.test(rawValue) ||
                                  rawValue === ""
                                ) {
                                  field.onChange(rawValue);
                                }
                              }}
                              onBlur={() => {
                                if (field.value) {
                                  // Format the value for display
                                  const formatted = formatCurrency(field.value);
                                  // Remove commas so that the raw value remains valid for the schema
                                  field.onChange(formatted.replace(/,/g, ""));
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4">
                      {/* Date Picker */}
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => {
                          // State to control the popover's open/close
                          const [open, setOpen] = useState(false);

                          return (
                            <FormItem className="flex-1">
                              <FormLabel>Date</FormLabel>
                              <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <button
                                      type="button"
                                      className="w-48 text-left bg-white border px-3 py-2 rounded-lg flex items-center justify-between"
                                      onClick={() => setOpen((prev) => !prev)}
                                    >
                                      {field.value
                                        ? format(field.value, "PPP")
                                        : "Pick a date"}
                                      <CalendarIcon className="w-4 h-4 text-gray-500" />
                                    </button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent align="start" className="w-85">
                                  <MyDaTePicker
                                    field={field}
                                    onClose={() => setOpen(false)}
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />

                      {/* Status */}
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex gap-4"
                              >
                                <FormItem className="flex items-center space-x-2">
                                  <RadioGroupItem value="Unpaid" />
                                  <FormLabel>Unpaid</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2">
                                  <RadioGroupItem value="Paid" />
                                  <FormLabel>Paid</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit Record"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-[35px] border border-red-100 m-12">
            <DataTable
              header={header}
              emptyMessage="No customers found."
              value={accounts}
              globalFilterFields={["name", "invoiceNumber", "amount", "status"]}
              scrollable
              stripedRows
              paginator
              filters={filters}
              rows={15}
              className=""
            >
              <Column field="name" header="Customer Name" sortable />
              <Column field="invoiceNumber" header="Invoice #" sortable />
              <Column
                header="Date"
                body={dateBodyTemplate}
                sortField="date"
                sortable
              />
              <Column
                field="amount"
                header="Amount"
                body={amountBodyTemplate}
                sortable
              />
              <Column
                header="Due Date"
                body={duedateBodyTemplate}
                sortField="dueDate"
                sortable
              />
              <Column
                field="status"
                header="Status"
                body={statusTemplate}
                sortable
              />
              <Column header="Actions" body={actionTemplate} />
            </DataTable>
          </div>
        </div>

        {/* Sidebar on the right, fixed width */}
        <div className="w-[300px]">
          <Sidebar />
        </div>

        {/* Edit Receivable Dialog */}
        <Dialog open={displayEdit} onOpenChange={setDisplayEdit}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Edit Receivable</DialogTitle>
              <DialogDescription>
                Update the receivable details and click save when done.
              </DialogDescription>
            </DialogHeader>
            <EditReceivable
              rowData={selectedRow}
              onClose={() => setDisplayEdit(false)}
              onSave={(updatedRecord) => handleFunction("edit", updatedRecord)}
            />
          </DialogContent>
        </Dialog>

        {/* Pay Now Dialog */}
        <Dialog open={displayPayNow} onOpenChange={setDisplayPayNow}>
          {/* Use conditional classes to change dialog width when expanded */}
          <DialogContent
            className={
              showPaymentForm ? "sm:max-w-[800px]" : "sm:max-w-[500px]"
            }
          >
            <DialogHeader>
              <DialogTitle>Pay Now</DialogTitle>
              <DialogDescription>
                Review the payment details and proceed to checkout.
              </DialogDescription>
            </DialogHeader>
            <PayNow
              rowData={selectedRow}
              showPaymentForm={showPaymentForm}
              setShowPaymentForm={setShowPaymentForm}
              onClose={() => setDisplayPayNow(false)}
              onPay={(paymentPayload) => handleFunction("pay", paymentPayload)}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={displayDelete} onOpenChange={setDisplayDelete}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Delete Record</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this record? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md"
                onClick={() => setDisplayDelete(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md"
                onClick={() => {
                  handleFunction("delete", selectedRow);
                  setDisplayDelete(false);
                }}
              >
                Delete
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Toaster />
    </>
  );
};

export default AccountsReceivable;
