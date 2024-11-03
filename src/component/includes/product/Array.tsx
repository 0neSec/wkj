import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import { X } from 'lucide-react';

interface ArrayInputProps {
  label: string;
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

const ArrayInput: React.FC<ArrayInputProps> = ({ 
  label, 
  value = [], 
  onChange, 
  placeholder 
}) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleAdd = (): void => {
    if (inputValue.trim()) {
      const newArray = [...value, inputValue.trim()];
      onChange(newArray);
      setInputValue('');
    }
  };

  const handleRemove = (index: number): void => {
    const newArray = value.filter((_, i) => i !== index);
    onChange(newArray);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">{label}</label>
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="border rounded-lg flex-1 p-2"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add
          </button>
        </div>
        
        <div className="mt-2 space-y-2">
          {value.map((item, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
            >
              <span className="flex-1">{item}</span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArrayInput;