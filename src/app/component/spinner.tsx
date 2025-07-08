// components/Spinner.tsx
export default function Spinner({
  size,
  color
}: {
  size?: number;
  color?: string;
}) {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`w-${size} h-${size} border-4 border-${color}-500 border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
}
