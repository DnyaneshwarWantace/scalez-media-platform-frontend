import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { CheckCircle } from "lucide-react";

function SignedUpSuccessfully() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Get Started with Ignite</h1>
          <p className="text-muted-foreground">Let's quickly get to know you!</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <Progress value={100} className="h-2" />
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Successfully Signed Up!</h3>
              <p className="text-muted-foreground">Redirecting you to dashboard...</p>
              <div className="mt-4">
                <img src="/static/illustrations/signedUpSuccessfully.svg" alt="Success" className="h-48" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-4">
          <button
            type="button"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignedUpSuccessfully;
