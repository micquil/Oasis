import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { apiServices1, apiServices } from "@/services/apiServices";
import Sidebar from "../sidebar/Sidebar.jsx";

const Reports = () => {
  const [receivables, setReceivables] = useState([]);
  const [payables, setPayables] = useState([]);
  const [filteredReceivables, setFilteredReceivables] = useState([]);
  const [filteredPayables, setFilteredPayables] = useState([]);
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    const fetchReceivables = async () => {
      try {
        const data = await apiServices1.getAllReceivables();
        setReceivables(data);
        setFilteredReceivables(data);
      } catch (error) {
        console.error("Error fetching receivables:", error);
      }
    };

    const fetchPayables = async () => {
      try {
        const data = await apiServices.getAllPayables();
        console.log("Payables Data:", data); // Debugging
        setPayables(data);
        setFilteredPayables(data);
      } catch (error) {
        console.error("Error fetching payables:", error);
      }
    };

    fetchReceivables();
    fetchPayables();
  }, []);

  useEffect(() => {
    if (customerName) {
      setFilteredReceivables(
        receivables.filter((item) =>
          item.name.toLowerCase().includes(customerName.toLowerCase())
        )
      );
      setFilteredPayables(
        payables.filter((item) =>
          item.name.toLowerCase().includes(customerName.toLowerCase())
        )
      );
    } else {
      setFilteredReceivables(receivables);
      setFilteredPayables(payables);
    }
  }, [customerName, receivables, payables]);

  const totalReceivables = filteredReceivables.reduce(
    (sum, item) => sum + parseFloat(item.amount),
    0
  );

  const totalPayables = filteredPayables.reduce(
    (sum, item) => sum + parseFloat(item.amount),
    0
  );

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Customer Report</h2>

        <Input
          type="text"
          placeholder="Enter Customer Name..."
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg border border-gray-300"
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <Card className="p-4 mb-6 bg-blue-100 shadow-md rounded-xl">
              <h3 className="text-xl font-semibold text-gray-700">
                Total Receivables {customerName && `for ${customerName}`}:
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                ₱{totalReceivables.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </p>
            </Card>

            {filteredReceivables.length > 0 ? (
              <div className="space-y-4">
                {filteredReceivables.map((item) => (
                  <Card key={item.invoiceNumber} className="p-4 bg-white shadow-md rounded-xl">
                    <CardContent>
                      <p className="text-lg font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">Invoice: {item.invoiceNumber}</p>
                      <p className="text-sm text-gray-500">Due Date: {item.dueDate}</p>
                      <p className="text-lg font-bold text-green-600">
                        ₱{parseFloat(item.amount).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No receivables found.</p>
            )}
          </div>

          <div className="col-span-1">
            <Card className="p-4 mb-6 bg-blue-100 shadow-md rounded-xl">
              <h3 className="text-xl font-semibold text-gray-700">
                Total Payables {customerName && `for ${customerName}`}:
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                ₱{totalPayables.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </p>
            </Card>

            {filteredPayables.length > 0 ? (
              <div className="space-y-4">
                {filteredPayables.map((item) => (
                  <Card key={item.invoiceNumber} className="p-4 bg-white shadow-md rounded-xl">
                    <CardContent>
                      <p className="text-lg font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">Invoice: {item.invoiceNumber}</p>
                      <p className="text-sm text-gray-500">Due Date: {item.dueDate}</p>
                      <p className="text-lg font-bold text-red-600">
                        ₱{parseFloat(item.amount).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No payables found.</p>
            )}
          </div>
        </div>
      </div>

      <Sidebar />
    </>
  );
};

export default Reports;
