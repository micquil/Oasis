import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Sidebar from "../sidebar/Sidebar.jsx";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import {
  apiServices,
  apiServices1,
  apiServices2,
} from "@/services/apiServices.js";

function Dashboard() {
  const recentPayments = [
    {
      id: 1,
      name: "John Doe",
      amount: 2500,
      method: "Credit Card",
      date: "Feb 15, 2025",
    },
    {
      id: 2,
      name: "Jane Smith",
      amount: 1800,
      method: "GCash",
      date: "Feb 14, 2025",
    },
    {
      id: 3,
      name: "Mark Lee",
      amount: 3200,
      method: "Bank Transfer",
      date: "Feb 13, 2025",
    },
    {
      id: 4,
      name: "Lucy Brown",
      amount: 1500,
      method: "Maya",
      date: "Feb 12, 2025",
    },
    {
      id: 5,
      name: "Alex Turner",
      amount: 2900,
      method: "PayPal",
      date: "Feb 11, 2025",
    },
  ];

  const paymentData = recentPayments.map((payment, index) => ({
    name: payment.date,
    amount: payment.amount,
  }));

  const [totalReceivable, setTotalReceivable] = useState();
  const [totalPayable, setTotalPayable] = useState();
  const [chartData, setChartData] = useState([]);
  const [totalInvoice, setTotalInvoice] = useState([]);
  const [daysAmount, setDaysAmount] = useState([]);
  const [payments, setPayments] = useState([]);

  const fetchData = async () => {
    try {
      const data = (await apiServices.getAllPayables()) || [];
      const totalPayableAmount =
        data.length > 0 ? data.reduce((sum, item) => sum + item.amount, 0) : 0;

      const data2 = (await apiServices1.getAllReceivables()) || [];
      const totalReceivableAmount =
        data2.length > 0
          ? data2.reduce((sum, item) => sum + item.amount, 0)
          : 0;

      const payables = (await apiServices.getAllPayables()) || [];
      const receivables = (await apiServices1.getAllReceivables()) || [];
      // Group data by month
      const monthlyData = {};

      // Function to process data
      const processData = (items, key) => {
        items.forEach((item) => {
          const date = new Date(item.date);
          const month = date.toLocaleString("default", { month: "short" }); // Get short month name (e.g., "Jan")
          const year = date.getFullYear();
          const monthKey = `${month} ${year}`; // Example: "Jan 2025"

          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
              month: monthKey,
              payables: 0,
              receivables: 0,
            };
          }

          monthlyData[monthKey][key] += item.amount; // Accumulate the amounts
        });
      };

      processData(payables, "payables");
      processData(receivables, "receivables");

      // Convert object to array and sort by date
      const formattedData = Object.values(monthlyData).sort(
        (a, b) => new Date(a.month) - new Date(b.month)
      );

      setChartData(formattedData);
      setTotalReceivable(totalReceivableAmount);
      setTotalPayable(totalPayableAmount);

      const data3 = (await apiServices2.getAllPayments()) || [];

      // Set total invoices
      setTotalInvoice(data3.length);

      // Get the latest five payments
      const latestPayments = [...data3]
        .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
        .slice(0, 5);

      setPayments(latestPayments);

      // Process last five days' payment amounts
      const today = new Date();
      const lastFiveDays = Array.from({ length: 5 }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - i);
        return date.toISOString().split("T")[0]; // YYYY-MM-DD format
      });

      const daysAmountData = lastFiveDays.map((date) => ({
        name: date, // X-axis label
        amount: data3
          .filter((item) => item.paymentDate.startsWith(date)) // Check payment date
          .reduce((sum, item) => sum + item.amount, 0), // Sum all amounts for that date
      }));

      setDaysAmount(daysAmountData);
    } catch (error) {
      console.error("Failed to fetch accounts payable:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-2">
          <div>
            <h1 className="text-4xl font-semibold text-gray-800">
              Welcome to Accounts Monitoring
            </h1>
            <p className="text-gray-500">
              Manage your accounts and invoices efficiently.
            </p>
          </div>
          <div className="flex items-center mt-4 md:mt-0 space-x-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                className="pl-8 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      john.doe@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Card className="bg-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Account Payables Total Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {totalPayable
                  ? totalPayable.toLocaleString("en-US", {
                      style: "currency",
                      currency: "PHP",
                    })
                  : "Loading..."}
              </div>
            </CardContent>
            <CardFooter>Total includes paid and unpaid amounts.</CardFooter>
          </Card>
          <Card className="bg-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Account Receivables Total Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {(totalReceivable ?? 0).toLocaleString("en-US", {
                  style: "currency",
                  currency: "PHP",
                })}
              </div>
            </CardContent>
            <CardFooter>Total includes paid and unpaid amounts.</CardFooter>
          </Card>

          <Card className="bg-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Paid Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {totalInvoice.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </section>
        {/* Main Dashboard Content */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <div className="w-full p-4 bg-white shadow-md rounded-xl">
              <h2 className="text-xl font-bold mb-4">
                Monthly Financial Report
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="payables"
                    stroke="#FF5733"
                    strokeWidth={2}
                    name="Account Payables"
                  />
                  <Line
                    type="monotone"
                    dataKey="receivables"
                    stroke="#33A1FF"
                    strokeWidth={2}
                    name="Account Receivables"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="col-span-1">
            <div className="p-4 bg-white rounded-xl shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Recent Payment Activity
              </h2>

              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead>Name</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.length > 0 ? (
                      payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{payment.name}</TableCell>
                          <TableCell className="text-green-600 font-medium">
                            ₱{payment.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>{payment.paymentMethod}</TableCell>
                          <TableCell>
                            {new Date(payment.paymentDate).toLocaleDateString(
                              "en-PH",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan="4" className="text-center">
                          No recent payments
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Payment trend graph */}
              <div className="mt-6">
                <h3 className="text-sm text-gray-600 mb-2">Payment Trends</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={daysAmount}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#4CAF50"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[300px]">
        <Sidebar />
      </div>
    </div>
  );
}

export default Dashboard;
