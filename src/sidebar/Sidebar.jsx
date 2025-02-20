import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Receipt,
  FileText,
  CreditCard,
  CircleDollarSign,
} from "lucide-react";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Account Receivables", icon: Receipt, href: "/receivables" },
  { label: "Account Payables", icon: CreditCard, href: "/payables" },
  { label: "Reports", icon: FileText, href: "/reports" },
  { label: "Payments", icon: CircleDollarSign, href: "/payments" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="fixed right-0 top-0 h-full w-[300px] bg-white border-l shadow-lg flex flex-col justify-between">
      {/* Logo Section */}
      <div className="px-6 py-4">
        <Link to="/">
          <h1 className="text-2xl font-bold text-gray-900">OASIS</h1>
          <span className="text-xs text-gray-500">v.01</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 space-y-1">
        {routes.map((route) => (
          <Button
            key={route.href}
            variant="ghost"
            className={`w-full justify-start gap-3 text-gray-700 hover:rounded-xl transition-all font-semibold ${
              location.pathname === route.href
                ? "bg-[#5932EA] text-white"
                : "hover:bg-[#5932EA] hover:text-white"
            }`}
            asChild
          >
            <Link to={route.href} className="flex w-full">
              <route.icon className="h-5 w-5" />
              {route.label}
            </Link>
          </Button>
        ))}
      </div>

      {/* Profile Section */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <img
            src="/images/oasis.png"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">Oasis</p>
            <p className="text-xs text-gray-500">Accounting</p>
          </div>
        </div>
      </div>
    </div>
  );
}
