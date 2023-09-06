import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { usePathname, useRouter } from "next/navigation"

interface DrawerProps {
   children: React.ReactNode;
   selector: string;
   isOpen: boolean;
   onClose: () => void
}

const Drawer= ({ children, selector, isOpen, onClose }: DrawerProps) => {
   const [mounted, setMounted] = useState(false)
   const pathname = usePathname()

   useEffect(() => {
    onClose();
  }, [pathname]);


   useEffect(() => {
      setMounted(true)

      return () => setMounted(false)
   }, [])

   const DrawerLayout = (props:{children: React.ReactNode}) => {
       return (
        <div className="fixed inset-0 w-screen h-screen" style={{zIndex:"1010"}}>
            <div className="fixed inset-0 w-screen h-screen bg-black opacity-50" onClick={onClose}></div>
               <div>{props.children}</div>
        </div>)
   }

   if(!isOpen){
       return null
   } else {
   return mounted
      ? createPortal(<DrawerLayout>{children}</DrawerLayout>, 
        //@ts-ignore
        document.querySelector(selector))
      : null}
}

export default Drawer