// import SignIn from "@/interfaces/auth/signIn";
// import { Suspense } from 'react';
// export default function Page() {
//     return (
//         <Suspense>
//             <SignIn />
//         </Suspense>
//     );
// }

//===================================// 9-17-2025

// In: app/login/page.tsx

import { SignIn } from '@/interfaces/auth/signIn';
import { Suspense } from 'react';
// --- Main Change 2: Use a named import { SignIn } ---
// Make sure this path is correct for your project structure

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignIn />
    </Suspense>
  );
}
