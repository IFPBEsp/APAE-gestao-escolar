export default function Input({ placeholder }: { placeholder: string }) {
  return <input type="text" placeholder={placeholder} className="border p-2 rounded-md w-full" />;
}
