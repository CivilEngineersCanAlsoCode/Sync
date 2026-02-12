import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X, Trash2 } from 'lucide-react';

interface StringListInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  addButtonLabel?: string;
}

export function StringListInput({ 
  value = [], 
  onChange, 
  placeholder = "Enter text...", 
  addButtonLabel = "Add Item" 
}: StringListInputProps) {
  
  const handleAdd = () => {
    onChange([...value, ""]);
  };

  const handleRemove = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const handleChange = (index: number, text: string) => {
    const newValue = [...value];
    newValue[index] = text;
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      {value.map((item, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={item}
            onChange={(e) => handleChange(index, e.target.value)}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleRemove(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAdd}
        className="w-full border-dashed"
      >
        <Plus className="h-3 w-3 mr-2" />
        {addButtonLabel}
      </Button>
    </div>
  );
}
