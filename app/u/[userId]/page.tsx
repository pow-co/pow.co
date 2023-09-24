import axios from "axios";
import UserProfileCard from "../../../components/UserProfileCard";
import ThreeColumnLayout from "../../../components/v13_ThreeColumnLayout"
import { userProfileCardAnonQuery } from "../../../services/twetch";
import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import UserLatestFeed from "../../../components/UserLatestFeed";

interface UserDetailsProps {
    address: string;
    banner?: string;
    avatar?: string;
    name?:  string;
    paymail?: string;
    bio?: string;
    url?: string;
}

type Props = {
    params: { userId: string}
}

async function getUserDetails(userId: string): Promise<UserDetailsProps | null>{
    let paymail = decodeURIComponent(userId) // userId is a paymail right now but could be something else in the future
    let address = decodeURIComponent(userId) 
    let banner, avatar, name, bio, url 
    
    const isTwetchUser = paymail?.includes("twetch")
    const isRelayXUser = paymail?.includes("relayx")
    const isHandcashUser = paymail?.includes("handcash")
    
    let id

    if(isTwetchUser){
        id = `@${paymail.split('_')[0]}`
        const polynym = await axios.get('https://api.polynym.io/getAddress/' + id)

        if (polynym.data){
            address = polynym.data.address
        }

        const twetchUserProfileCard = await userProfileCardAnonQuery(parseInt(paymail.split("@")[0]));
        banner = twetchUserProfileCard.banner,
        avatar = twetchUserProfileCard.icon,
        name = twetchUserProfileCard.name,
        bio = twetchUserProfileCard.description,
        url = twetchUserProfileCard.profileUrl

    } else if (isRelayXUser) {
        id = paymail
        const polynym = await axios.get('https://api.polynym.io/getAddress/' + id)

        if (polynym.data){
            address = polynym.data.address
        }

        const relayXUserProfileCardResponse = await axios.get(`https://staging-backend.relayx.com/api/profile/${paymail}`)
        const relayXUserProfileCard = relayXUserProfileCardResponse.data.data

        avatar = `https://a.relayx.com/u/${paymail}`
        name = relayXUserProfileCard.profile ? relayXUserProfileCard.profile?.name : `1${paymail.split("@")[0]}` ,
        bio = relayXUserProfileCard.profile ? relayXUserProfileCard.profile?.bio : "",
        url = relayXUserProfileCard.profile ? relayXUserProfileCard.profile?.website : ""

    } else if (isHandcashUser){
        id = `$${paymail.split('_')[0]}`
        const polynym = await axios.get('https://api.polynym.io/getAddress/' + id)

        if (polynym.data){
            address = polynym.data.address
        }

        avatar = `https://cloud.handcash.io/v2/users/profilePicture/${paymail}`,
        name = `$${paymail.split('@')[0]}`
    } else {
        address = paymail.split('_')[0],
        name = address
        avatar = `https://api.dicebear.com/6.x/pixel-art/svg?seed=${paymail}`
    }

    const userDetails: UserDetailsProps =  {
        address,
        banner, 
        avatar,
        name,
        paymail,
        bio,
        url,
    }

    return userDetails
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const userId = params.userId

    const userDetails = await getUserDetails(userId)

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []

    return {
        title: userDetails?.name ? `${userDetails.name} on Bitcoin` : 'PoW observer on Bitcoin',
        description: userDetails?.bio ? `${userDetails.bio} on Bitcoin` : 'PoW observer on Bitcoin',
        openGraph: {
            title: userDetails?.name ? `${userDetails.name} on Bitcoin` : 'PoW observer on Bitcoin',
            description: userDetails?.bio ? `${userDetails.bio} on Bitcoin` : 'PoW observer on Bitcoin',
            url:"https://pow.co",
            siteName: 'PoW.co',
            images: [{
                //url: txDetails?.files![0].base64Content || "https://dogefiles.twetch.app/c3775f42d22ba9a68b5e134fd7b59b0c6060bf00a45e8890853b20e167e73a25",
                url: userDetails?.avatar ? userDetails?.avatar : "https://dogefiles.twetch.app/c3775f42d22ba9a68b5e134fd7b59b0c6060bf00a45e8890853b20e167e73a25",
                width: 1200,
                height: 600
            }, ...previousImages],
            locale: 'en_US',
            type: 'website',
        },
        twitter: {
            title: userDetails?.name ? `${userDetails.name} on Bitcoin` : 'PoW observer on Bitcoin',
            description:userDetails?.bio ? `${userDetails.bio} on Bitcoin` : 'PoW observer on Bitcoin',
            //images: [txDetails?.files![0].base64Content || "https://dogefiles.twetch.app/c3775f42d22ba9a68b5e134fd7b59b0c6060bf00a45e8890853b20e167e73a25", ...previousImages]
            images: [userDetails?.avatar! ,"https://dogefiles.twetch.app/c3775f42d22ba9a68b5e134fd7b59b0c6060bf00a45e8890853b20e167e73a25", ...previousImages]
        }
    }
}

const UserDetailPage = async ({
        params: { userId },
    }: {
        params: { userId: string }
    }) => {

    const userDetails = await getUserDetails(userId)

    return (
        <ThreeColumnLayout>
            <div className="col-span-12 lg:col-span-6 min-h-screen mb-[200px]">
                <div className="my-5 sm:my-10">
                    {userDetails && <UserProfileCard banner={userDetails.banner} avatar={userDetails.avatar!} userName={userDetails.name!} paymail={userDetails.paymail!} description={userDetails.bio} url={userDetails.url}/>}
                </div>
                <div className="flex mt-6 mb-4 mx-0 px-4">
                <div className="flex">
                  <Link href={`/u/${userId}`}>
                    <div className="text-sm leading-4 py-2 px-3 text-gray-900 dark:text-white bg-primary-100 dark:bg-primary-600/20 font-medium mr-2 cursor-pointer rounded-md whitespace-nowrap">
                      Latest
                    </div>
                  </Link>
                  {/* <Link href={`/u/${userId}/boosts`}>
                    <div className="text-sm leading-4 py-2 px-3 text-gray-700 dark:text-gray-300 font-normal mr-2 cursor-pointer rounded-md whitespace-nowrap">
                      Boosts
                    </div>
                  </Link> */}
                </div>
            </div>
            <UserLatestFeed userId={userId} />

            </div>
        </ThreeColumnLayout>
    )
}

export default UserDetailPage