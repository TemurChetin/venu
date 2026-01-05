import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Search } from "lucide-react";
import Link from "next/link";

import "./[lang]/globals.css";

type Props = {};

function NotFound({}: Props) {
  return (
    <html>
      <head>
        <title>Page not found</title>
      </head>
      <body>
        <div className="flex flex-col items-center justify-center min-h-[100vh] px-4 py-12">
          <div className="text-center space-y-6 max-w-md">
            {/* 404 Number */}
            <div className="space-y-2">
              <h1 className="text-9xl font-bold text-primary">404</h1>
              <div className="w-24 h-1 bg-primary mx-auto"></div>
            </div>

            {/* Error Message */}
            <div className="space-y-3">
              <h2 className="text-3xl font-bold">Page not found</h2>
              <p className="text-muted-foreground text-lg">
                The page you are looking for does not exist or has been removed.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="gap-2">
                <Link href="/">
                  <Home className="size-5" />
                  Go Home
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/search">
                  <Search className="size-5" />
                  Go Search
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

export default NotFound;
