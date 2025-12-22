import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import BottomNavigationWrapper from "./bottom-navigation-wrapper";

type Props = {};

function MobileHeader({}: Props) {
  return (
    <header>
      <div className="container mt-4">
        {/* Searching input decoration */}
        <div className="flex gap-2">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Mahsulot va turkumlarni izlash"
              className="h-11 w-full pl-10 pr-10 bg-accent/50 border-0 focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        </div>
      </div>

      <BottomNavigationWrapper />
    </header>
  );
}

export default MobileHeader;
