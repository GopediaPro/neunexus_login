export const HeaderLayout = () => {
  return (
    <header className="shadow-sm border-b px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="text-gray-500">햄버거</button>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 bg-blue-500 rounded-full text-white">🔍</button>
          <button className="w-9 h-9 bg-blue-500 rounded-full text-white">문</button>
          <button className="w-9 h-9 bg-blue-500 rounded-full text-white">알</button>
          <button className="w-9 h-9 bg-blue-500 rounded-full text-white">나</button>
        </div>
      </div>
    </header>
  );
};