export const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center pt-1 pl-1 text-caption text-error-500">
      <span>{message}</span>
    </div>
  );
};