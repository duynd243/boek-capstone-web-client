import React from 'react'
import {NextPage} from 'next'
import {useRouter} from "next/router";
import {useQuery} from "@tanstack/react-query";
import {getSlug} from "../../../utils/helper";
import {PostLayout} from "../index";
import Head from "next/head";

const PostDetails: NextPage = () => {
    console.log('PostDetails');
    const router = useRouter();
    const {id: postId} = router.query;

    const {data: post, isLoading} = useQuery(['post', postId],
        () => fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`).then(res => res.json()),
        {
            onSuccess: async (data: any) => {
                if (data?.title) {
                    await router.push({
                        pathname: '/posts/[slug]/[id]',
                        query: {slug: getSlug(data?.title), id: postId}
                    }, undefined, {shallow: true})
                }
                console.log(data)
            },
            onError: () => {
                console.log('alo')
            }
        }
    );
    if (isLoading) return <div>Loading...</div>

    return (
        <>
            <Head>
                <title>{post?.title}</title>
            </Head>
            <PostLayout>
                <div>{JSON.stringify(post)}</div>
            </PostLayout>
        </>
    )
}

export default PostDetails