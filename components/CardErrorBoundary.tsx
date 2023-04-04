import React from 'react';

 interface CardErrorBoundaryProps {
     children: React.ReactNode
 }

 interface CardErrorBoundaryState {
     hasError: boolean
 }

 class CardErrorBoundary extends React.Component<CardErrorBoundaryProps, CardErrorBoundaryState> {
     constructor(props:CardErrorBoundaryProps) {
     super(props);
     this.state = { hasError: false };
   }
   static getDerivedStateFromError(error: any) {
     return { hasError: true };
   }
   componentDidCatch(error: any, errorInfo: any) {
     console.log({ error, errorInfo });
   }
   render() {
     if (this.state.hasError) {
       return (
          <div  className='flex content-center bg-primary-100 dark:bg-primary-600/20 hover:sm:bg-primary-200 hover:dark:sm:bg-primary-500/20 mt-0.5 first:md:rounded-t-lg last:md:rounded-b-lg h-32'>
           <div className={``}>
                         <div className='mt-1 text-gray-900 dark:text-white text-base leading-6 whitespace-pre-line break-words'>
                         <h2>Oops, there is an error!</h2>
                         </div>
             <div>
           <button
             type="button"
             onClick={() => this.setState({ hasError: false })}
           >
             Try again?
           </button>
           </div>
           </div>
         </div>
       )
     }
     return this.props.children;
 }
 }

 export default CardErrorBoundary;