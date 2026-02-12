import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus } from 'lucide-react';

interface SkillTagInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  placeholder?: string;
  categoryName: string; // for accessible labels
}

export function SkillTagInput({ skills, onChange, placeholder, categoryName }: SkillTagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (skillToRemove: string) => {
    onChange(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge key={skill} variant="secondary" className="px-2 py-1 text-sm flex items-center gap-1">
            {skill}
            <button
              type="button"
              onClick={() => handleRemove(skill)}
              className="hover:text-destructive focus:outline-none"
              aria-label={`Remove ${skill} from ${categoryName}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Add a skill..."}
          className="flex-1"
        />
        <Button type="button" onClick={handleAdd} size="icon" variant="outline">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add</span>
        </Button>
      </div>
    </div>
  );
}
