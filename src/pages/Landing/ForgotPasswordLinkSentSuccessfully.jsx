import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { MailCheck } from "lucide-react";

export default function ForgotPasswordLinkSentSuccessfully() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("accessToken", null) !== null && localStorage.getItem("accessToken", null) !== undefined) {
      window.open("/dashboard", "_self");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <MailCheck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Email Sent!</h3>
              <p className="text-muted-foreground">We've forwarded further instructions to your email</p>
              <Button
                className="w-full h-11 bg-black hover:bg-black/90 text-white font-medium mt-4"
                onClick={() => navigate("/login")}
              >
                Back to Log In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
