import Link from "next/link"

export const Footer = () => {
  return (
    <footer className="border-t border-gray-700" style={{ backgroundColor: "#323332" }}>
    <div className="container px-4 py-8 md:px-6">
      {/* Add Logo at the top of the footer */}
      <div className="mb-8">
        <svg width="150" height="90" viewBox="0 0 2000 2000" className="fill-[#CC9765]" aria-label="Layls">
          <g>
            <path
              d="M199.09,1081.64V705.03h-77.95v390.42c0,21.08,2.86,39.56,8.79,55.29c5.79,15.84,13.74,29.02,23.7,39.55
      c10.05,10.52,21.76,18.4,35.51,23.44c13.58,5.07,28.23,7.61,43.71,7.61c11.1,0,21.66-0.63,31.61-2.14
      c10.09-1.42,18.01-2.93,24.07-4.46v-70.85c-11.07,3.43-23.66,5.18-37.53,5.18C216.34,1149.07,199.09,1126.67,199.09,1081.64"
            />
            <path
              d="M1403.39,1081.64V705.03h-77.94v390.42c0,21.08,2.88,39.56,8.81,55.29c5.81,15.84,13.71,29.02,23.68,39.55
      c10.08,10.52,21.8,18.4,35.53,23.44c13.58,5.07,28.22,7.61,43.69,7.61c11.1,0,21.65-0.63,31.65-2.14
      c10.03-1.42,17.99-2.93,24.04-4.46v-70.85c-11.11,3.43-23.68,5.18-37.55,5.18C1420.67,1149.07,1403.39,1126.67,1403.39,1081.64"
            />
            <path
              d="M736.57,890.99c0-121.84-57.25-182.81-171.73-182.81c-17.12,0-33.51,1.65-49.51,3.99
      c-31.33,2.53-60.72,8.17-86.59,19.52v6.53v44.57v28.4c35.76-23.59,76.94-35.38,123.71-35.38c14.48,0,27.7,1.64,39.4,5.06
      c11.69,3.3,21.8,7.99,30.22,14.09c6.85,4.93,11.49,11.16,15.83,17.62c13.51,20.6,20.68,49.18,20.68,86.65l-146.06,20.53
      c-107.2,14.96-160.79,68.33-160.79,159.85c0,42.84,13.7,77.2,41.09,102.93c27.45,25.88,65.48,38.8,113.96,38.8h37.33
      c198.36-5.89,192.47-171.82,192.47-171.82V890.99z M658.58,1049.51c0,103.95-114.48,103.95-114.48,103.95h-31.36
      c-22.24-2.01-41.44-8.18-55.65-20.85c-16.99-15.21-25.48-34.74-25.48-58.71c0-32.83,9.19-55.75,27.62-68.68
      c18.36-12.94,45.66-21.97,81.79-27.03l117.57-16.34V1049.51z"
            />
            <path
              d="M1869.12,1024.36c-6.36-14.33-15.73-27.12-27.7-38.07c-12.03-11.02-26.66-20.91-43.81-29.77
      c-17.14-8.74-36.39-17.23-58.08-25.6c-16.11-6.33-30.59-12.3-43.19-17.64c-12.77-5.45-23.58-11.53-32.37-18.23
      c-8.93-6.76-15.58-14.32-20.29-22.97c-4.55-8.61-6.81-19.26-6.81-32.05c0-10.28,2.26-19.52,6.81-28.05
      c4.71-8.48,11.08-15.69,19.51-21.78c8.44-6.08,18.53-10.8,30.23-14.07c11.7-3.43,24.96-5.07,39.47-5.07
      c24.93,0,48.16,3.59,69.94,10.32v-70.92c-18.69-3.61-38.52-5.45-59.38-5.45c-23.82,0-46.88,3.04-69.33,9.12
      c-22.27,5.96-42.15,14.98-59.65,27c-17.42,11.92-31.36,26.76-41.84,44.48c-10.44,17.76-15.73,38.06-15.73,61.11
      c0,18.77,2.73,35.25,8.31,49.3c5.53,13.96,13.84,26.51,24.79,37.52c10.85,11.05,24.55,20.92,40.86,29.66
      c16.34,8.9,35.23,17.52,56.93,26.13c15.45,6.1,29.98,11.93,43.43,17.52c13.49,5.56,25.19,11.89,35.29,18.87
      c9.93,7.1,17.86,15.08,23.82,24.22c5.77,9.14,8.68,20.15,8.68,33.21c0,17.56-6.14,31-16.5,41.53
      c-16.77,16.02-46.91,22.81-61.41,25.15c-4.52,0.49-9.08,1-13.66,1.4c-6.9,0.5-13.76,0.94-20.74,1.13
      c-3.24,0.07-6.45-0.07-9.57-0.07c-61.13,0-121.17-11.59-121.17-11.59v70.86c0,0,3.67,0.77,9.25,1.71
      c4.64,0.95,8.63,1.85,14.77,2.72c1.93,0.27,4.08,0.19,5.94,0.41c43.18,5.88,125.06,11.26,192.64-13.32
      c6.46-2.29,12.79-4.56,18.79-7.34c1.65-0.84,3.48-1.21,5.12-2.04h-1.37c6.58-3.3,13.32-6.4,19.3-10.41
      c17.76-11.77,32.02-26.74,42.58-44.59c10.69-17.91,16.02-38.94,16.02-63.14C1879,1055.79,1875.73,1038.68,1869.12,1024.36"
            />
            <path
              d="M1028.72,1074.67L887.04,705.03h-87.57l184.77,482.34l-2.48,6.4c-17.61,21.41-39.18,33.14-65.74,33.14
      c-13.95,0-29.33-2.92-46.07-8.61v70.34c13.58,4.22,30.59,6.24,50.9,6.24c56.05,0,102.25-30.88,138.93-91.92
      c0,0,6.04-10.91,6.58-11.93c0,0,17.4-34.54,22.88-48.41l172.68-437.6h-87.55L1028.72,1074.67z"
            />
          </g>
        </svg>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold mb-4 text-white">Shop</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                New Arrivals
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                Used Dresses
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                Rental Options
              </Link>
            </li>
            <li>
              <Link href="/vendors" className="text-sm text-gray-300 hover:text-white transition-colors">
                Vendors
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4 text-white">Help</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                Shipping
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                Returns
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4 text-white">About</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                Our Story
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                Vendors
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                Careers
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                Press
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4 text-white">Connect</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                Instagram
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                Facebook
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                Pinterest
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                Twitter
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-8 border-t border-gray-700">
        <p className="text-sm text-gray-400">© 2025 DressMarket. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  </footer>
  )

}