import { Spinner } from '@/components/ui/Spinner';

const TestComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="mb-6">
        <Spinner />
      </div>
      <p className="text-lg font-semibold text-gray-700">Loading...</p>
    </div>
  );
};

export default TestComponent;
