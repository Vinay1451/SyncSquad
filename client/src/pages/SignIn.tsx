import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function SignIn() {
  const [, navigate] = useLocation();

  const handleEnterDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4"
      >
        <Card className="p-6 shadow-lg">
          <CardContent className="pt-6 text-center">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 20l3.824-3.824a.6.6 0 00.176-.424V10.5A1.5 1.5 0 0020.5 9h-15A1.5 1.5 0 004 10.5V16.5" />
                  <path d="M8 16l.5-8h5.5l.5 8" />
                  <path d="M8 4h8" />
                  <path d="M10 4v4" />
                  <path d="M14 4v4" />
                  <circle cx="7" cy="20" r="1" />
                  <circle cx="11" cy="20" r="1" />
                  <circle cx="15" cy="20" r="1" />
                </svg>
              </div>
              <h1 className="mt-6 text-3xl font-bold">Diabetes Care AI</h1>
              <p className="mt-2 text-muted-foreground">
                Your personal health monitoring system
              </p>
            </div>

            <Button 
              className="w-full py-6 text-lg" 
              onClick={handleEnterDashboard}
            >
              Enter Dashboard
            </Button>

            <p className="mt-6 text-sm text-muted-foreground">
              Powered by advanced AI and non-invasive monitoring
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
