
const Signup = () => {
  return (
    <div className="w-full h-screen bg-gray-800 flex justify-center items-center">
      <div className="w-[590px] p-24 bg-gray-700 rounded-3xl shadow-[2px_4px_30px_0px_rgba(0,0,0,0.10)] flex flex-col items-center gap-10">
        {/* 회원가입 폼 */}
        <div className="w-full flex flex-col gap-6">
          <h1 className="text-white text-2xl font-bold font-['Pretendard']">
            회원가입
          </h1>

          <div className="flex flex-col gap-10">
            {/* 입력 필드들 */}
            <div className="flex flex-col gap-5">
              {/* 이름 필드 */}
              <div className="flex flex-col gap-2">
                <label className="text-neutral-400 text-base font-semibold font-['Pretendard']">
                  이름
                </label>
                <input
                  type="text"
                  placeholder="이름을 입력하세요"
                  className="h-14 px-4 bg-neutral-700 rounded-lg border-[1.5px] border-zinc-600 text-zinc-200 text-base font-semibold font-['Pretendard'] placeholder:text-neutral-400 focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>

              {/* 이메일 필드 */}
              <div className="flex flex-col gap-2">
                <label className="text-neutral-400 text-base font-semibold font-['Pretendard']">
                  이메일
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="h-14 px-4 bg-neutral-700 rounded-lg border-[1.5px] border-zinc-600 text-zinc-200 text-base font-semibold font-['Pretendard'] placeholder:text-neutral-400 focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>

              {/* 비밀번호 필드 */}
              <div className="flex flex-col gap-2">
                <label className="text-neutral-400 text-base font-semibold font-['Pretendard']">
                  비밀번호
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="8자리 이상의 비밀번호를 입력하세요"
                    className="h-14 px-4 pr-12 bg-neutral-700 rounded-lg border-[1.5px] border-zinc-600 text-zinc-200 text-base font-semibold font-['Pretendard'] placeholder:text-neutral-400 focus:border-blue-400 focus:outline-none transition-colors w-full"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              className="w-full py-4 bg-blue-500 rounded-lg text-white text-xl font-bold font-['Pretendard'] hover:bg-blue-600 active:bg-blue-700 transition-colors"
            >
              회원가입
            </button>
          </div>

          {/* 로그인 링크 */}
          <div className="flex justify-center items-center text-sm font-['Pretendard']">
            <span className="text-neutral-50 font-medium">
              이미 계정이 있으신가요?
            </span>
            <button
              type="button"
              className="px-2.5 py-3 text-blue-500 font-bold underline hover:text-blue-400 transition-colors"
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
