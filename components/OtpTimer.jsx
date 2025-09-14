// import React, { useState, useEffect } from 'react';

// function OtpTimer({ initialMinutes = 1, onResend }) {
//   const [minutes, setMinutes] = useState(initialMinutes);
//   const [seconds, setSeconds] = useState(0);
//   const [isTimerActive, setIsTimerActive] = useState(true);

//   useEffect(() => {
//     if (!isTimerActive) return;

//     const myInterval = setInterval(() => {
//       if (seconds > 0) {
//         setSeconds(seconds - 1);
//       }
//       if (seconds === 0) {
//         if (minutes === 0) {
//           clearInterval(myInterval);
//           setIsTimerActive(false);
//         } else {
//           setMinutes(minutes - 1);
//           setSeconds(59);
//         }
//       }
//     }, 1000);

//     return () => {
//       clearInterval(myInterval);
//     };
//   }, [isTimerActive, minutes, seconds]);

//   const handleResendClick = () => {
//     setMinutes(initialMinutes);
//     setSeconds(0);
//     setIsTimerActive(true);
//     onResend();
//   };

//   return (
//     <div className='text-center'>
//       {isTimerActive ? (
//         <p className='text-gray-600'>
//           Time remaining:{' '}
//           <span className='font-semibold text-indigo-600'>
//             {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
//           </span>
//         </p>
//       ) : (
//         <div className='flex items-center justify-center space-x-2'>
//           <p className='text-gray-600'>Didn't receive the code?</p>
//           <button
//             onClick={handleResendClick}
//             type='button'
//             className='font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none'
//           >
//             Resend
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default OtpTimer;
