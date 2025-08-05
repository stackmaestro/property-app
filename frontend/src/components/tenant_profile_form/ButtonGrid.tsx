import React from 'react';
import Button from '../globals/Button';

interface ButtonGridProps {
  label: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  required?: boolean;
  columns?: {
    base?: number;
    sm?: number;
    lg?: number;
  };
}

const ButtonGrid: React.FC<ButtonGridProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
  required = false,
  columns = { base: 1, sm: 2, lg: 3 }
}) => {
  const getGridClasses = () => {
    const { base, sm, lg } = columns;
    
    const gridPatterns: Record<string, string> = {
      "2-3-5": "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3", 
      "1-2-4": "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3",   
      "1-2-3": "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", 
    };
    
    const pattern = `${base}-${sm}-${lg}`;
    return gridPatterns[pattern] || "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3";
  };

  return (
    <div className="form-group">
      <label className="form-label">
        {label} {required && '*'}
      </label>
      <div className={getGridClasses()}>
        {options.map((option) => (
          <Button
            key={option}
            variant="selection"
            selected={selectedValue === option}
            onClick={() => onSelect(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ButtonGrid;