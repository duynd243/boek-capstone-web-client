import React from 'react'
import {NextPage} from 'next'
import {useQuery} from "@tanstack/react-query";
import Link from "next/link";

export const PostLayout = ({children}: { children: React.ReactNode }) => {
    return (

        <>
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row justify-between items-center">
                    <Link className="text-2xl font-bold text-gray-900" href="/">
                        Next Blog
                    </Link>
                </div>
                <div className="flex flex-row justify-between items-center">
                    <Link href="/posts" className="text-lg font-bold text-gray-900">
                        Posts
                    </Link>
                </div>
            </div>
            {children}
        </>
    )
}

const Posts: NextPage = () => {
    const {data: posts, isLoading} = useQuery(['posts'],
        () => {
            return fetch('https://jsonplaceholder.typicode.com/posts').then(res => res.json())
        }
    );
    if (isLoading) return <div>Loading...</div>;

    return (
        <PostLayout>
            <div className='max-w-6xl mx-auto'>
                {posts.map((post: any) => (
                    <div key={post.id}
                         className='p-4 bg-white shadow overflow-hidden sm:rounded-lg mb-4'>
                        <Link
                            href={`/posts/slug/${post.id}`}>
                            {post.id} - {post.title}
                        </Link>
                    </div>
                ))}
            </div>
        </PostLayout>
    )
}

export default Posts