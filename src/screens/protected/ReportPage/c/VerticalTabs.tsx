'use client';

import { cn } from '@/lib/utils'; // optional shadcn utility
import { 
  Activity, 
  Users, 
  FileText, 
  TrendingUp, 
  Shield, 
  PiggyBank 
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'financial', label: 'Financial Summary', icon: <Activity className="h-5 w-5" /> },
  { id: 'growth', label: 'User Growth', icon: <Users className="h-5 w-5" /> },
  { id: 'loans', label: 'Loan Distribution', icon: <FileText className="h-5 w-5" /> },
  { id: 'revenue', label: 'Revenue Breakdown', icon: <TrendingUp className="h-5 w-5" /> },
  { id: 'kyc', label: 'KYC Verification', icon: <Shield className="h-5 w-5" /> },
  { id: 'savings', label: 'Savings Trend', icon: <PiggyBank className="h-5 w-5" /> },
];

interface ResponsiveReportNavProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function ResponsiveReportNav({ activeTab, onTabChange }: ResponsiveReportNavProps) {
  const sharedButtonClasses = (isActive: boolean) =>
    cn(
      "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap",
      isActive
        ? "bg-muted text-foreground font-semibold border-l-4 border-primary"
        : "text-muted-foreground hover:bg-muted/50"
    );

  return (
    <aside className="w-full md:w-64 bg-card border-b md:border-b-0 md:border-r shadow-sm">
      {/* Header (optional - can add "Reports" title here) */}
      <div className="flex items-center gap-3 px-5 py-4 border-b md:border-none">
        <Activity className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-lg">Reports</h2>
      </div>

      {/* Mobile: Horizontal Scrollable Tabs */}
      <nav className="flex overflow-x-auto md:hidden scrollbar-hide">
        <div className="flex gap-1 px-2 py-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                sharedButtonClasses(activeTab === item.id),
                "rounded-lg min-w-fit"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop: Vertical Sidebar */}
      <nav className="hidden md:flex md:flex-col gap-1 p-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              sharedButtonClasses(activeTab === item.id),
              "w-full justify-start rounded-lg"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}