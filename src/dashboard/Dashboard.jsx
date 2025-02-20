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

function Dashboard() {
  const data = [
    { month: "Jan", payables: 15000, receivables: 10000 },
    { month: "Feb", payables: 10000, receivables: 20000 },
    { month: "Mar", payables: 9000, receivables: 13000 },
    { month: "Apr", payables: 13000, receivables: 1000 },
    { month: "May", payables: 14000, receivables: 17000 },
    { month: "Jun", payables: 16000, receivables: 18000 },
  ];
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
              <div className="text-2xl font-bold text-red-500">₱21,500</div>
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
              <div className="text-2xl font-bold text-blue-500">₱14,500</div>
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
              <div className="text-2xl font-bold text-green-500">148</div>
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
                <LineChart data={data}>
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
                    {recentPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.name}</TableCell>
                        <TableCell className="text-green-600 font-medium">
                          ₱{payment.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell>{payment.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Payment trend graph */}
              <div className="mt-6">
                <h3 className="text-sm text-gray-600 mb-2">Payment Trends</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={paymentData}>
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
