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
        style={{
          width: `${size}rem`,
          height: `${size}rem`,
          borderWidth: "3px"
        }}
        className={`border-2 border-${color}-500 border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
}
