interface InputFieldProps {
  type: "text" | "email" | "number" | "date" | "password";
  id: string;
  disabled?: boolean;
  inputClass?: string;
  placeholder?: string;
  label?: string;
  labelClass?: string;
  error?: any;
  formProps?: any;
  value?:any;
}

export default function InputTextBox({
  type,
  id,
  disabled,
  inputClass = "",
  labelClass = "",
  placeholder,
  label,
  error,
  formProps,
  value
}: InputFieldProps) {
  const hasError = !!error?.message;

  return (
    <div className="flex flex-col gap-1.5 w-full mb-4">
      {label && (
        <label
          htmlFor={id}
          className={`text-sm font-semibold text-gray-700 capitalize text-start ${labelClass}`}
        >
          {label}
        </label>
      )}
      <input
        value={value}
        type={type}
        id={id}
        disabled={disabled}
        placeholder={placeholder}
        {...formProps}
        className={`
          px-4 py-2 rounded-lg border shadow-sm transition-all duration-200
          placeholder:text-gray-400 focus:outline-none focus:ring-2
          ${hasError
            ? "border-red-500 focus:ring-red-500/12 focus:border-red-500"
            : "border-gray-300 focus:ring-blue-500/12 focus:border-blue-500"}
          disabled:bg-gray-50 disabled:cursor-not-allowed
          ${inputClass}
        `}
      />
      {hasError && (
        <span className="text-red-500 text-xs font-medium text-start">
          {error.message}
        </span>
      )}
    </div>
  );
}
