export const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent" />
      <p className="mt-4 text-gray-600">로딩 중입니다. 잠시만 기다려주세요...</p>
    </div>
  );
};
