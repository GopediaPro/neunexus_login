export const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center pt-2 pl-1 text-sm text-web-error">
      <span className="text-body2">{message}</span>
    </div>
  );
};