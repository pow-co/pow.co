import { useRouter } from "next/router";
import ThreeColumnLayout from "../components/ThreeColumnLayout";
import { useBitcoin } from "../context/BitcoinContext";
import { useState } from "react";
import Loader from "../components/Loader";
import { useAPI } from "../hooks/useAPI";
import NotificationCard, { Notification } from "../components/NotificationCard";

const SAMPLE_NOTIFICATIONS = [
    {
        type: "boost",
        actor: {
            name: "1OwenKellogg",
            paymail: "owenkellogg@relayx.io",
            avatar: "https://a.relayx.com/u/owenkellogg@relayx.io"
        },
        url: "/d829d9eebdff6081f122af8499905c6a48477254921cfc5e203d92d34940ee70",
        createdAt: new Date(),
        description: "Boosted your post",
        difficulty: 1.34
    }, 
    {
        type: "like",
        actor: {
            name: "1EddieWillers",
            paymail: "eddiewillers@relayx.io",
            avatar: "https://a.relayx.com/u/eddiewillers@relayx.io"
        },
        url: "/d829d9eebdff6081f122af8499905c6a48477254921cfc5e203d92d34940ee70",
        createdAt: new Date(),
        description: "Liked your post",
        value: 1500
    },
    {
        type: "reply",
        actor: {
            name: "1DanielKrawisz",
            paymail: "danielkrawisz@relayx.io",
            avatar: "https://a.relayx.com/u/danielkrawisz@relayx.io"
        },
        url: "/d829d9eebdff6081f122af8499905c6a48477254921cfc5e203d92d34940ee70",
        createdAt: new Date(),
        description: "replied to your post",
        difficulty: 2
    },
    {
        type: "mention",
        actor: {
            name: "1ShirishSarkar",
            paymail: "shirishsarkar@relayx.io",
            avatar: "https://a.relayx.com/u/shirishsarkar@relayx.io"
        },
        url: "/d829d9eebdff6081f122af8499905c6a48477254921cfc5e203d92d34940ee70",
        createdAt: new Date(),
        description: "mentionned you",
        difficulty: 0.054
    },
    {
        type: "buy",
        actor: {
            name: "1iElvis",
            paymail: "ielvis@relayx.io",
            avatar: "https://a.relayx.com/u/ielvis@relayx.io"
        },
        url: "/d829d9eebdff6081f122af8499905c6a48477254921cfc5e203d92d34940ee70",
        createdAt: new Date(),
        description: "Bought an item from you",
        value: 100000000
    }
]

export default function NotificationsPage(){
    const { authenticated, paymail } = useBitcoin()
    const router = useRouter()
    const { data, error, loading } = useAPI(`/notifications/${paymail}`, '')

    if(!authenticated){
        router.push("/")
    }

    //const { notifications } = data || []
    const notifications = SAMPLE_NOTIFICATIONS
    return (
        <ThreeColumnLayout>
            <div className="col-span-12 min-h-screen lg:col-span-6">
                <div className="mb-[200px] mt-5 lg:mt-10">
                    {loading ? <Loader /> :(
                        <>
                            {notifications?.map((notification: any, index:number) => {
                                return <NotificationCard key={`notification_${index}`} {...notification}/>
                            })}
                        </>
                    )}
                </div>
            </div>

        </ThreeColumnLayout>
    )
}