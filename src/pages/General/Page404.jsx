import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Home, LogOut } from "lucide-react";

export default function Page404() {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken","");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-muted flex items-center justify-center p-4">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="w-full lg:w-1/3 flex justify-center">
            <img
              className="w-full max-w-sm"
              src="/static/404.svg"
              alt="404 Not Found"
            />
          </div>

          {/* Content Section */}
          <div className="w-full lg:w-1/3 text-center lg:text-left space-y-4">
            <h1 className="text-8xl sm:text-9xl font-bold text-foreground">404</h1>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Sorry, the page you're looking for cannot be found.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                className="bg-black hover:bg-black/90 text-white h-11"
                onClick={() => navigate("/")}
              >
                <Home className="h-4 w-4 mr-2" />
                Go back to the App
              </Button>

              {accessToken && (
                <Button
                  variant="destructive"
                  className="h-11"
                  onClick={() => {
                    localStorage.clear();
                    navigate("/");
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
