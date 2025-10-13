export default function Button({ text }: { text: string }) {
  return (
    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
      {text}
    </button>
  );
}
