// // Third-party Imports
// import 'react-perfect-scrollbar/dist/css/styles.css'

// // Type Imports
// import type { ChildrenType } from '@core/types'

// // Style Imports
// import '@/app/globals.css'

// // Generated Icon CSS Imports
// import '@assets/iconify-icons/generated-icons.css'

// export const metadata = {
//   title: 'Materio - Material Design Next.js Admin Template',
//   description:
//     'Materio - Material Design Next.js Admin Dashboard Template - is the most developer friendly & highly customizable Admin Dashboard Template based on MUI v5.'
// }

// const RootLayout = ({ children }: ChildrenType) => {
//   // Vars
//   const direction = 'ltr'

//   return (
//     <html id='__next' lang='en' dir={direction}>
//       <body className='flex is-full min-bs-full flex-auto flex-col'>{children}</body>
//     </html>
//   )
// }


// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css';

// Type Imports
import type { ChildrenType } from '@core/types';

// Style Imports
import '@/app/globals.css';

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css';

// Component Imports
import Providers from '../components/Providers';

export const metadata = {
  title: 'Pallet Tracker App Designed and developed by Mate4Tech',
  description: 'Materio - Material Design Next.js Admin Dashboard Template - is the most developer friendly & highly customizable Admin Dashboard Template based on MUI v5.'
};

const RootLayout = ({ children }: ChildrenType) => {
  // Vars
  const direction = 'ltr';

  return (
    <html id='__next' lang='en' dir={direction}>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <Providers direction={direction}>
          {children}
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
