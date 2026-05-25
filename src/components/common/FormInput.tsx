import type { IFormInputProps } from '../../types';



const FormInput = ({ label, name, type = 'text', register, error, required, placeholder }: IFormInputProps) => {
  const isTextarea = type === 'textarea';
  
  return (
    <div>
      <label className="block text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      {isTextarea ? (
        <textarea
          {...register(name)}
          rows={3}
          className="w-full p-2 border rounded-lg"
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          {...register(name)}
          className="w-full p-2 border rounded-lg"
          placeholder={placeholder}
        />
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default FormInput;