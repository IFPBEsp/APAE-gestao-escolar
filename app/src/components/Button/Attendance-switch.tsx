interface AttendanceSwitchProps {
  value: boolean; // true = presente, false = ausente
  onChange: (value: boolean) => void;
}

export function AttendanceSwitch({ value, onChange }: AttendanceSwitchProps) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`
        relative flex items-center w-36 h-10 rounded-full transition-all duration-300 px-2
        ${value ? "bg-green-600" : "bg-red-600"}
      `}
    >
      {/* Bolinha */}
      <div
        className={`
          absolute bg-[#B2D7EC] h-8 w-8 rounded-full shadow-md transform transition-transform duration-300
          ${value ? "translate-x-24" : "translate-x-0"}
        `}
      />

      {/* Texto "Presente" que desliza */}
      {value && (
        <span
          className={`
            absolute font-semibold text-white text-sm transition-all duration-300
            translate-x-4
          `}
        >
          Presente
        </span>
      )}

      {/* Texto "Ausente" que aparece quando o switch está vermelho */}
      {!value && (
        <span
          className={`
            absolute font-semibold text-white text-sm transition-all duration-300
            translate-x-16
          `}
        >
          Ausente
        </span>
      )}
    </button>
  );
}
