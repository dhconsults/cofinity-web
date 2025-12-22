import { ArrowLeft, PiggyBank } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

type TopNavProps = {
  title: string;
  icon: React.ReactNode;
  description?: string;
  link?: string;
};

export default function TopNav({
  title,
  icon,
  description,
  link,
}: TopNavProps) {
  const navigate = useNavigate();

  return (
    <div className="border-b border-gray-200 bg-white px-6 py-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(link ? link : -1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {title ?? "Dashboard"}
            </h1>
            <p className="text-sm text-gray-600">
              {description ?? "Welcome to your dashboard"}
            </p>
          </div>
        </div>

        {icon ?? (
          <PiggyBank className="h-8 w-8 text-gray-400 hidden sm:block" />
        )}
      </div>
    </div>
  );
}
