// src/components/FilterPopover.tsx

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";

// Define the structure for each filter section (e.g., "By Status", "By Category")
type FilterSection = {
  title: string;
  stateKey: string; // The key in our state object (e.g., 'status', 'category')
  options: string[];
};

// Define the props our component will accept
type FilterPopoverProps = {
  filterSections: FilterSection[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (newFilters: Record<string, string[]>) => void;
};

export const FilterPopover = ({
  filterSections,
  selectedFilters,
  onFilterChange,
}: FilterPopoverProps) => {

  const handleCheckedChange = (key: string, value: string, checked: boolean) => {
    const currentValues = selectedFilters[key] || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);

    onFilterChange({
      ...selectedFilters,
      [key]: newValues,
    });
  };

  const clearFilters = () => {
    const clearedFilters: Record<string, string[]> = {};
    Object.keys(selectedFilters).forEach(key => {
        clearedFilters[key] = [];
    });
    onFilterChange(clearedFilters);
  };
  
  const hasActiveFilters = Object.values(selectedFilters).some(arr => arr.length > 0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="border-border/50 relative">
          <Filter className="w-4 h-4" />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-accent rounded-full border-2 border-background" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 glass-card" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
             <h4 className="font-medium leading-none text-foreground">Filter Options</h4>
             <Button variant="link" size="sm" onClick={clearFilters} className="p-0 h-auto text-muted-foreground">
                Clear all
             </Button>
          </div>
          
          {filterSections.map((section) => (
            <div key={section.title} className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{section.title}</p>
              <div className="space-y-2">
                {section.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${section.stateKey}-${option}`}
                      checked={selectedFilters[section.stateKey]?.includes(option)}
                      onCheckedChange={(checked) =>
                        handleCheckedChange(section.stateKey, option, !!checked)
                      }
                    />
                    <Label
                      htmlFor={`${section.stateKey}-${option}`}
                      className="font-normal text-foreground"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};