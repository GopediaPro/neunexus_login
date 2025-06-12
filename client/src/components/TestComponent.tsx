import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useQuery } from "@tanstack/react-query";

const TestComponent = () => {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => fetch('https://api.example.com/user').then(res => res.json())
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('https://api.example.com/posts').then(res => res.json())
  });

  if (userLoading || postsLoading) return <div>로딩중...</div>;
  
  return (
    <div className="flex flex-col justify-center items-center">
      <ThemeToggle />
      <h1>유저: {user?.firstName} {user?.lastName}</h1>
      <h2>게시글:</h2>
      {posts?.map((post: any) => (
        <div className="flex">
          <div key={post.id}>• {post.title}</div>
          <div>{post.content}</div>
        </div>
      ))}
      <div className="w-[36.875rem] rounded-lg shadow-lg p-8 border-2">
        <div className="space-y-4">

          <img 
            src="/image/logo.png"
            alt="로고"
            className="w-[15rem] h-[8rem]"
          />

          <div className="flex">
            <h1 className="text-2xl font-semibold">로그인</h1>
          </div>

          <form className="flex flex-col gap-5">            
            <Input
              id="비밀번호"
              type="text"
              placeholder="아이디"
              error=""
            />
            <Input
              id="비밀번호"
              type="text"
              placeholder="아이디"
              error=""
            />
            <Input
              id="아이디"
              type="text"
              placeholder="아이디"
              error="사용자를 찾을 수 없습니다."
            />
            <Checkbox />
          </form>
        </div>
        
      </div>
    </div>
  );
}

export default TestComponent;