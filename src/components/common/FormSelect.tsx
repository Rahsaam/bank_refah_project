import type { IFormSelectProps } from '../../types';




const FormSelect = ({ label, name, options, register, error, required }: IFormSelectProps) => {
  return (
    <div>
      <label className="block text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <select {...register(name)} className="w-full p-2 border rounded-lg">
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default FormSelect;