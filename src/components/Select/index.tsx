// Importações necessárias
import { useRouter } from 'next/router';
import { ChangeEvent } from 'react';

type SelectComponentProps = {
    currentValue: string,
    options: { 
      value: string; 
      label: string 
    }[];
};

const Select = ({ currentValue, options } : SelectComponentProps) => {
  const router = useRouter();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const url = event.target.value;
    router.push(url);
  };

  return (
    <select onChange={handleChange} className="border p-2 rounded" value={currentValue}>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;