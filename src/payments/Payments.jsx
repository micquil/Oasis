import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { apiServices2 } from "/src/services/apiServices.js";
import Sidebar from "../sidebar/Sidebar.jsx";
import { toast, Toaster } from "react-hot-toast";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await apiServices2.getAllPayments();
      const sortedData = response.sort((a, b) => b.id - a.id);
      setPayments(sortedData);
      
    } catch (error) {
      console.error("Failed to fetch payments:", error);
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const openPayDialog = () => {
    setSelectedPayment({
      invoiceNumber: "",
      name: "",
      amount: "",
      paymentDate: new Date(),
      paymentMethod: "",
      referenceNumber: "",
    });
    setPayDialogOpen(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here you would typically call an API to process the payment
      // For now, we'll just simulate it with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Payment processed successfully");
      setPayDialogOpen(false);
      fetchPayments(); // Refresh the payment list
    } catch (error) {
      console.error("Failed to process payment:", error);
      toast.error("Failed to process payment");
    }
  };

  const formatDate = (value) => {
    return value ? format(new Date(value), "PP") : "";
  };

  const formatCurrency = (value) => {
    return value
      ? new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP",
        }).format(value)
      : "";
  };

  const header = (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-bold">Payments</h2>
      <Button
        onClick={openPayDialog}
        className="bg-green-500 hover:bg-green-600"
      >
        Pay
      </Button>
    </div>
  );

  return (
    <>
      {/* Main container with sidebar */}
      <div className="flex min-h-screen bg-gray-100">
        {/* Main content */}
        <div className="flex-1 min-w-0 px-24">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Payment Management
          </h1>
          <DataTable
            value={payments}
            paginator
            rows={10}
            dataKey="referenceId"
            loading={loading}
            header={header}
            emptyMessage="No payments found."
            className="p-datatable-customers"
          >
            <Column field="referenceId" header="Reference ID" sortable />
            <Column field="invoiceNumber" header="Invoice Number" sortable />
            <Column field="name" header="Name" sortable />
            <Column field="type" header="Type" sortable />
            <Column
              field="paymentDate"
              header="Payment Date"
              body={(rowData) => formatDate(rowData.paymentDate)}
              sortable
            />
            <Column field="paymentMethod" header="Payment Method" sortable />
            <Column
              field="amount"
              header="Amount"
              body={(rowData) => formatCurrency(rowData.amount)}
              sortable
            />
            <Column
              field="referenceNumber"
              header="Reference Number"
              sortable
            />
          </DataTable>

          <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Process Payment</DialogTitle>
                <DialogDescription>
                  Enter the payment details below.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handlePaymentSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="invoiceNumber" className="text-right">
                      Invoice Number
                    </Label>
                    <Input
                      id="invoiceNumber"
                      value={selectedPayment?.invoiceNumber}
                      onChange={(e) =>
                        setSelectedPayment({
                          ...selectedPayment,
                          invoiceNumber: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={selectedPayment?.name}
                      onChange={(e) =>
                        setSelectedPayment({
                          ...selectedPayment,
                          name: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Amount
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      value={selectedPayment?.amount}
                      onChange={(e) =>
                        setSelectedPayment({
                          ...selectedPayment,
                          amount: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="paymentDate" className="text-right">
                      Payment Date
                    </Label>
                    <div className="col-span-3">
                      <Calendar
                        selected={selectedPayment?.paymentDate}
                        onSelect={(date) =>
                          setSelectedPayment({
                            ...selectedPayment,
                            paymentDate: date,
                          })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="paymentMethod" className="text-right">
                      Payment Method
                    </Label>
                    <Select
                      id="paymentMethod"
                      value={selectedPayment?.paymentMethod}
                      onValueChange={(value) =>
                        setSelectedPayment({
                          ...selectedPayment,
                          paymentMethod: value,
                        })
                      }
                      className="col-span-3"
                    >
                      <option value="Check">Check</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cash">Cash</option>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="referenceNumber" className="text-right">
                      Reference Number
                    </Label>
                    <Input
                      id="referenceNumber"
                      value={selectedPayment?.referenceNumber}
                      onChange={(e) =>
                        setSelectedPayment({
                          ...selectedPayment,
                          referenceNumber: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Process Payment</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sidebar on the right, fixed width */}
        <div className="w-[300px]">
          <Sidebar />
        </div>
      </div>

      {/* Toaster outside the main container */}
      <Toaster />
    </>
  );
};

export default Payments;
