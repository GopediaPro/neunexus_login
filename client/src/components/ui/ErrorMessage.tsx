export const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center pt-1 pl-1 text-sm text-page-error">
      <span className="text-body2">{message}</span>
    </div>
  );
};