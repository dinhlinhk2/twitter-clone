import Post from "./Post";
import PostSkeleton from "../skeleton/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({ feedType, params, user }) => {
    const getPostEndPoint = () => {
        switch (feedType) {
            case 'forYou':
                return 'getall'
            case 'following':
                return 'following'
            case 'posts':
                return `user/${params.username}`
            case 'likes':
                return `getlikepost/${user._id}`
            default:
                return 'allpost'
        }
    }
    const POST_ENDPOINT = getPostEndPoint()
    const { data: POSTS, isLoading, isRefetching, refetch } = useQuery({
        queryKey: [`post/${POST_ENDPOINT}`],
        // queryFn: async () => {
        //     try {
        //         const res = await axiosInstance.get(POST_ENDPOINT)
        //         console.log(res);
        //         return res.data
        //     } catch (error) {
        //         console.log(error);
        //         throw new Error(error)
        //     }
        // },
        retry: false
    })
    useEffect(() => {
        refetch()
    }, [feedType, refetch, params])


    return (
        <>
            {isLoading && isRefetching && (
                <div className='flex flex-col justify-center'>
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </div>
            )}
            {!isLoading && !isRefetching && POSTS.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
            {!isLoading && !isRefetching && POSTS && (
                <div>
                    {POSTS?.map((post) => (
                        <Post key={post._id} post={post} POST_ENDPOINT={POST_ENDPOINT} />
                    ))}
                </div>
            )}
        </>
    );
};
export default Posts;