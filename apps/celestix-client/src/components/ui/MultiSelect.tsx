import { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

export const MultiSelect = ({ options, selected, onChange, placeholder }: { options: { id: number, name: string, description: string }[], selected: string[], onChange: (selected: string[]) => void, placeholder?: string }) => {
    const [open, setOpen] = useState(false);

    const handleSelect = (option: string) => {
        onChange([...selected, option]);
        setOpen(false);
    };

    const handleUnselect = (option: string) => {
        onChange(selected.filter((s) => s !== option));
    };

    const selectables = options.filter((option) => !selected.includes(option.name));

    return (
        <Command className="overflow-visible bg-transparent">
            <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <div className="flex gap-1 flex-wrap">
                    {selected.map((option) => (
                        <Badge key={option} variant="secondary">
                            {option}
                            <button
                                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleUnselect(option);
                                    }
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                onClick={() => handleUnselect(option)}
                            >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                        </Badge>
                    ))}
                    <CommandInput placeholder={placeholder || "Select options..."} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} />
                </div>
            </div>
            <div className="relative mt-2">
                {open && selectables.length > 0 ? (
                    <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {selectables.map((option) => (
                                    <CommandItem
                                        key={option.id}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onSelect={() => handleSelect(option.name)}
                                        className={"cursor-pointer"}
                                    >
                                        {option.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </div>
                ) : null}
            </div>
        </Command>
    );
};
