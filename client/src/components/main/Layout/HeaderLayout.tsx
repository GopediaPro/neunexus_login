export const HeaderLayout = () => {
  return (
    <header className="shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="text-gray-500">햄버거</button>
          <div className="text-blue-600 font-bold text-xl">WMT</div>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 bg-blue-500 rounded-full text-white">검색 아이콘</button>
          <button className="w-8 h-8 bg-blue-500 rounded-full text-white">문자</button>
          <button className="w-8 h-8 bg-blue-500 rounded-full text-white">알림</button>
          <button className="w-8 h-8 bg-blue-500 rounded-full text-white">나가기</button>
        </div>
      </div>
    </header>
  );
};