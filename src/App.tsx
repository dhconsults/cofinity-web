import { Loader, Settings } from "lucide-react";
import "./App.css";
import Button from "./components/Button";
import { Card } from "./components/Card";
import { Input } from "./components/Input";
import NavbarButton from "./components/NavbarButton";

function App() {
  return (
    <>
      <NavbarButton icon={<Loader />} clasName="mb-5">
        {" "}
        Not Now
      </NavbarButton>
      <NavbarButton icon={<Settings />}> Settings</NavbarButton>
      {[1, 2, 3, 4, 5, 6].map((value, key) => (
        <NavbarButton key={key} icon={<Settings />}>
          {" "}
          {`Settings ${value}`}
        </NavbarButton>
      ))}
      <div className="flex flex-col items-center gap-4 min-h-screen justify-center bg-red-500 ">
        <Button>Default</Button>
        <button className="bg-green-400 p-6"> hello there</button>
        <Button variant="outline" className="bg-green-800">
          Outline
        </Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Delete</Button>
        <Button variant="link">Learn more</Button>
        <Button isLoading>Loading...</Button>
        <Button size="lg" className="w-40">
          Large
        </Button>
      </div>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card
          title="User Details"
          description="Please fill in your basic information"
          footer={
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              Submit
            </button>
          }
          className="max-w-sm w-full"
        >
          <div className="space-y-3">
            <Input label="Full Name" placeholder="John Doe" />
            <Input label="Email" placeholder="you@example.com" type="email" />
            <Input label="Password" placeholder="••••••••" type="password" />
          </div>
        </Card>
      </div>
    </>
  );
}

export default App;
