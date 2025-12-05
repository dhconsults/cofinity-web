import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center px-4 md:px-6">
      {/* Heading */}
      <h1 className="text-4xl md:text-6xl font-bold mb-4">Oops!</h1>

      {/* 404 Text */}
      <div className="text-[80px] md:text-[150px] lg:text-[180px] font-extrabold leading-none mb-4">
        4<span className="mx-2">0</span>4
      </div>

      {/* Subtitle */}
      <p className="text-base md:text-lg opacity-80 mb-8 max-w-sm md:max-w-none">
        You are lost.
      </p>

      {/* Back Button */}
      <Button
        variant="outline"
        className="border-white text-white hover:bg-white hover:text-black transition w-full max-w-xs md:max-w-sm"
        onClick={() => navigate(-1)} // Go back to previous page
      >
        ← Go Back
      </Button>
    </div>
  );
}
