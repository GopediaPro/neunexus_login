import { Spinner } from './Spinner'; // 경로는 상황 맞게

export const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-[#264a6e]">
      <Spinner />
    </div>
  );
};
