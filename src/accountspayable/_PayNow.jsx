import React, { useState } from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Landmark, Banknote, Wallet } from "lucide-react";
import Select from "react-select";

export function PayNow({
  onClose,
  rowData,
  onPay,
  showPaymentForm,
  setShowPaymentForm,
}) {
  const [paymentDetails, setPaymentDetails] = useState({
    paymentDate: "",
    paymentMethod: "",
    amount: rowData?.amount || 0,
    referenceNumber: "",
  });

  // Update local state based on input changes
  const handleChange = (e) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };

  // Options for react-select with icons
  const options = [
    {
      value: "Cash",
      label: (
        <div className="flex items-center gap-2">
          <Banknote color="blue" size={16} />
          <span>Cash</span>
        </div>
      ),
    },
    {
      value: "Bank Transfer",
      label: (
        <div className="flex items-center gap-2">
          <Wallet color="blue" size={16} />
          <span>Bank Transfer</span>
        </div>
      ),
    },
    {
      value: "Check",
      label: (
        <div className="flex items-center gap-2">
          <Landmark color="blue" size={16} />
          <span>Check</span>
        </div>
      ),
    },
  ];

  // Compute selected option from paymentDetails.paymentMethod
  const selectedOption = options.find(
    (option) => option.value === paymentDetails.paymentMethod
  );

  // Validate and send data for payment
  const handleConfirmPayment = () => {
    // Validate that required fields are filled
    if (
      !paymentDetails.paymentDate ||
      !paymentDetails.paymentMethod ||
      !paymentDetails.referenceNumber
    ) {
      alert("Please fill in all payment fields.");
      return;
    }

    // Construct the payload with correct field names for createPayment
    const payload = {
      referenceId: rowData.id, // or rowData.referenceId, adjust as needed
      invoiceNumber: rowData.invoiceNumber,
      name: rowData.name,
      type: "Payable", // or another type if needed
      paymentDate: paymentDetails.paymentDate,
      paymentMethod: paymentDetails.paymentMethod,
      amount: paymentDetails.amount,
      referenceNumber: paymentDetails.referenceNumber,
    };

    console.log("Payload:", payload);
    onPay(payload);
    onClose();
  };

  if (!rowData) return null;

  return (
    <>
      <div className={`flex gap-4`}>
        {/* Invoice Details Section */}
        <div className={`${showPaymentForm ? "w-1/2" : "w-full"}`}>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">Invoice #:</span>
              <span>{rowData.invoiceNumber}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">Name:</span>
              <span>{rowData.name}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">Status:</span>
              <span
                className={
                  rowData.status === "Unpaid"
                    ? "text-red-500"
                    : "text-green-500"
                }
              >
                {rowData.status}
              </span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">Due Date:</span>
              <span>{rowData.dueDate}</span>
            </div>
            <div className="border-b my-2" />
            <div className="text-center">
              <p className="text-lg font-medium text-gray-600">Total Amount</p>
              <p className="text-4xl font-bold text-green-600">
                ₱{rowData.amount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Extended Payment Form Section */}
        {showPaymentForm && (
          <div className="w-1/2">
            <div className="flex flex-col gap-3 border-l pl-4">
              <div>
                <label className="text-gray-700 font-medium">
                  Payment Date:
                </label>
                <input
                  type="date"
                  name="paymentDate"
                  value={paymentDetails.paymentDate}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mt-1"
                />
              </div>
              <div>
                <label className="text-gray-700 font-medium">
                  Payment Method:
                </label>
                <Select
                  value={selectedOption}
                  onChange={(newOption) =>
                    handleChange({
                      target: { name: "paymentMethod", value: newOption.value },
                    })
                  }
                  options={options}
                  placeholder="Select Payment Method"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      borderRadius: "0.375rem",
                      border: "1px solid #d1d5db",
                      padding: "0.2rem",
                    }),
                  }}
                />
              </div>

              <div>
                <label className="text-gray-700 font-medium">Amount:</label>
                <input
                  type="number"
                  name="amount"
                  value={paymentDetails.amount}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mt-1"
                  disabled
                />
              </div>
              <div>
                <label className="text-gray-700 font-medium">
                  Reference Number:
                </label>
                <input
                  type="text"
                  name="referenceNumber"
                  value={paymentDetails.referenceNumber}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mt-1"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <DialogFooter className="mt-4">
        {!showPaymentForm ? (
          <>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => setShowPaymentForm(true)}>Pay Now</Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => setShowPaymentForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPayment}>Confirm Payment</Button>
          </>
        )}
      </DialogFooter>
    </>
  );
}
