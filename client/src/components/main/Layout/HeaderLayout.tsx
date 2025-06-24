import { keycloakLogout } from "@/services/keycloakLogout";
import { useNavigate } from "react-router-dom";

export const HeaderLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
      try {
        await keycloakLogout();

        navigate('/login');
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <header className="px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="text-gray-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 7C3 6.44772 3.44772 6 4 6H20C20.5523 6 21 6.44772 21 7C21 7.55229 20.5523 8 20 8H4C3.44772 8 3 7.55229 3 7Z" fill="#A9A9A9"/>
              <path d="M4 11C3.44772 11 3 11.4477 3 12C3 12.5522 3.44772 13 4 13H20C20.5523 13 21 12.5522 21 12C21 11.4477 20.5523 11 20 11H4Z" fill="#A9A9A9"/>
              <path d="M3 17C3 16.4477 3.44772 16 4 16H20C20.5523 16 21 16.4477 21 17C21 17.5523 20.5523 18 20 18H4C3.44772 18 3 17.5523 3 17Z" fill="#A9A9A9"/>
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex justify-center items-center w-9 h-9 bg-page-blue-400 text-page-font-primary rounded-full">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M10.7019 4C7.00052 4 4 7.00052 4 10.7019C4 14.4032 7.00052 17.4037 10.7019 17.4037C12.2681 17.4037 13.7097 16.8657 14.8505 15.9656L18.654 19.7691C18.9619 20.077 19.4611 20.077 19.7691 19.7691C20.077 19.4612 20.077 18.9619 19.7691 18.654L15.9655 14.8505C16.8657 13.7097 17.4037 12.2681 17.4037 10.7019C17.4037 7.00052 14.4032 4 10.7019 4ZM5.5769 10.7019C5.5769 7.87143 7.87142 5.57691 10.7019 5.57691C13.5323 5.57691 15.8268 7.87143 15.8268 10.7019C15.8268 12.1173 15.254 13.3974 14.3257 14.3258C13.3974 15.2541 12.1173 15.8268 10.7019 15.8268C7.87142 15.8268 5.5769 13.5323 5.5769 10.7019Z" fill="white" stroke="white" strokeWidth="0.2"/>
            </svg>
          </button>
          <button className="flex justify-center items-center w-9 h-9 bg-page-blue-400 text-page-font-primary rounded-full">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.1 13.3187L3 8.77206V17.25C3 18.2165 3.80589 19 4.8 19H19.2C20.1941 19 21 18.2165 21 17.25V8.77205L12.9 13.3187C12.3431 13.6313 11.6569 13.6313 11.1 13.3187Z" fill="white"/>
              <path d="M12 11.8031L3 6.75134V6.75C3 5.7835 3.80589 5 4.8 5H19.2C20.1941 5 21 5.7835 21 6.75V6.75133L12 11.8031Z" fill="white"/>
            </svg>
          </button>
          <button className="flex justify-center items-center w-9 h-9 bg-page-blue-400 text-page-font-primary rounded-full">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2.5C8.56356 2.5 5.77778 5.33553 5.77778 8.83333V11.5122C5.77778 12.6935 5.31676 13.8264 4.49612 14.6617C4.17846 14.985 4 15.4235 4 15.8808V16.6707C4 17.3391 4.53236 17.881 5.18908 17.881H8.50044C8.50044 18.2108 8.50708 18.9282 8.88458 19.6258C9.48708 20.7392 10.655 21.5 12 21.5C13.345 21.5 14.5129 20.7392 15.1154 19.6258C15.4929 18.9282 15.4996 18.2108 15.4996 17.881H18.8109C19.4676 17.881 20 17.3391 20 16.6707V15.8808C20 15.4235 19.8215 14.985 19.5039 14.6617C18.6833 13.8264 18.2222 12.6935 18.2222 11.5122V8.83333C18.2222 5.33553 15.4364 2.5 12 2.5ZM13.7218 17.881C13.7218 18.1813 13.7006 18.4897 13.5582 18.7528C13.2566 19.3101 12.6748 19.6882 12.0059 19.6905H12H11.994C11.3252 19.6882 10.7434 19.3101 10.4418 18.7528C10.2994 18.4897 10.2782 18.1813 10.2782 17.881H13.7218Z" fill="white"/>
            </svg>
          </button>
          <button 
            onClick={handleLogout}
            className="flex justify-center items-center w-9 h-9 bg-page-blue-400 text-page-font-primary rounded-full">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4.88889C12 5.37981 11.602 5.77778 11.1111 5.77778H5.77777L5.77777 18.2222H11.1111C11.602 18.2222 12 18.6202 12 19.1111C12 19.602 11.602 20 11.1111 20H5.77777C4.79594 20 4 19.2041 4 18.2222V5.77778C4 4.79594 4.79594 4 5.77777 4H11.1111C11.602 4 12 4.39797 12 4.88889Z" fill="white"/>
              <path d="M14.6667 15.1874L16.9652 12.889H9.33336C8.84244 12.889 8.44448 12.491 8.44448 12.0001C8.44448 11.5092 8.84244 11.1112 9.33336 11.1112L16.9652 11.1112L14.6667 8.81269C14.3195 8.46556 14.3195 7.90275 14.6667 7.55561C15.0138 7.20848 15.5766 7.20848 15.9237 7.55561L19.7396 11.3715C19.9063 11.5382 20 11.7643 20 12.0001C20 12.2358 19.9063 12.4619 19.7396 12.6286L15.9238 16.4445C15.5766 16.7916 15.0138 16.7916 14.6667 16.4445C14.3196 16.0974 14.3196 15.5346 14.6667 15.1874Z" fill="white"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};