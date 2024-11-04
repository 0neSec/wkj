import React, { useState } from 'react';

interface ArrayInputProps {
  label: string;
  value?: string[]; // Add ? to make it optional
  onChange: (newValue: string[]) => void;
  placeholder: string;
}

const ArrayInput: React.FC<ArrayInputProps> = ({ label, value = [], onChange, placeholder }) => {
  const [newItem, setNewItem] = useState('');

  const handleAddItem = () => {
    if (newItem.trim() !== '') {
      onChange([...value, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemoveItem = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700">{label}</label>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={placeholder}
          className="border rounded-lg flex-1 p-2"
        />
        <button
          onClick={handleAddItem}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add
        </button>
      </div>
      <div className="mt-2 space-y-2">
        {value.map((item, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-100 rounded-lg p-2">
            <span>{item}</span>
            <button
              onClick={() => handleRemoveItem(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArrayInput;