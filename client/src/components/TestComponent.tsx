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
      <h1>유저: {user?.firstName} {user?.lastName}</h1>
      <h2>게시글:</h2>
      {posts?.map((post: any) => (
        <div className="flex">
          <div key={post.id}>• {post.title}</div>
          <div>{post.content}</div>
        </div>
      ))}
    </div>
  );
}

export default TestComponent;