import Post from "./Post";
import PostSkeleton from "../skeleton/PostSkeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../utils/axios";
import { useEffect } from "react";

const Posts = ({ feedType, params, user }) => {
    const getPostEndPoint = () => {
        switch (feedType) {
            case 'forYou':
                return '/post/getall'
            case 'following':
                return '/post/following'
            case 'posts':
                return `/post/user/${params.username}`
            case 'likes':
                return `/post/getlikepost/${user._id}`
            default:
                return '/post/allpost'
        }
    }
    const POST_ENDPOINT = getPostEndPoint()
    const { data: POSTS, isLoading } = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            try {
                const res = await axiosInstance.get(POST_ENDPOINT)
                console.log(res);
                return res.data
            } catch (error) {
                console.log(error);
                throw new Error(error)
            }
        },
        retry: false
    })
    const queryClient = useQueryClient()
    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ['posts'] })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [feedType])


    return (
        <>
            {isLoading && (
                <div className='flex flex-col justify-center'>
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </div>
            )}
            {!isLoading && POSTS.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
            {!isLoading && POSTS && (
                <div>
                    {POSTS?.map((post) => (
                        <Post key={post._id} post={post} />
                    ))}
                </div>
            )}
        </>
    );
};
export default Posts;