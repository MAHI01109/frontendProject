import * as React from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar'; // Use the shadcn Calendar component or implement one
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

interface DatePickerProps {
  selected?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  placeholder = 'Select date',
  className,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          className={className}
          readOnly
          value={selected ? format(selected, 'yyyy-MM-dd') : ''}
          placeholder={placeholder}
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            onChange(date as Date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
