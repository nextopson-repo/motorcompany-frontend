import { ChevronRight, Copyright } from "lucide-react";

const Footer = () => {
  const carForSaleCities = [
    { title: "Delhi", link: "#" },
    { title: "Chandigarh", link: "#" },
    { title: "Ahemdabad", link: "#" },
    { title: "Pune", link: "#" },
    { title: "Jaipur", link: "#" },
  ];

  const carForSaleCities2 = [
    { title: "Lucknow", link: "#" },
    { title: "Bhopal", link: "#" },
    { title: "Indore", link: "#" },
    { title: "hyderabad", link: "#" },
    { title: "Kanpur", link: "#" },
  ];

  const linksData = [
    { page: "About Us", link: "/about" },
    { page: "Careers", link: "/career" },
    { page: "Terms & Conditions", link: "/terms-and-conditions" },
    { page: "Privacy Policy", link: "/privacy-policy" },
    { page: "Contact Us", link: "/contact-us" },
  ];

  return (
    <footer className="w-full max-w-7xl mx-auto md:border-t bg-[#F7F7F7] border-gray-300 md:px-8">
      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-6 md:grid-cols-18 gap-4 items-end border-b border-gray-300 pt-4 md:pb-4">
        {/* Logo + Description */}
        <div className="col-span-6 md:col-span-5 space-y-2 md:space-y-4 pr-8 text-gray-700 md:pb-4 px-4">
          <img
            src="/Brand-logo.png"
            alt="Dhikkar"
            className="h-5 md:h-10 w-auto"
          />
          <p className="text-[8px] md:text-[10px] font-semibold leading-[0.65rem] md:leading-[0.75rem] tracking-tight">
            Motor Company is the most trusted way of buying and selling used
            cars. Choose from over 5000 fully inspected second-hand car models.
          </p>
          <span className="flex items-center underline gap-2 text-[11px] font-semibold tracking-tighter group text-[#EE1422] hover:underline">
            <p>Join our Network and Grow your Business!</p>
            <span>
              <ChevronRight className="h-4 w-4 text-[#EE1422] group-hover:ml-2 transition-all duration-500 cursor-pointer" />
            </span>
          </span>

          <span className="flex md:hidden gap-3 text-gray-800 text-[9px] font-semibold">
            Contact With Us :
            <span className="flex gap-3 items-center ">
              {/* facebook */}
              <a href="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47 14 5.5 16 5.5H17.5V2.14C17.174 2.097 15.943 2 14.643 2C11.928 2 10 3.657 10 6.7V9.5H7V13.5H10V22H14V13.5Z"
                    fill="black"
                  />
                </svg>
              </a>
              {/* linkedin */}
              <a href="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <g clipPath="url(#clip0_1177_1476)">
                    <path
                      d="M17.04 17.043H14.078V12.403C14.078 11.296 14.055 9.872 12.534 9.872C10.99 9.872 10.754 11.076 10.754 12.321V17.043H7.793V7.5H10.637V8.8H10.676C11.073 8.05 12.04 7.26 13.484 7.26C16.485 7.26 17.04 9.234 17.04 11.805V17.043ZM4.447 6.194C3.493 6.194 2.727 5.423 2.727 4.474C2.727 3.525 3.494 2.754 4.447 2.754C4.90317 2.754 5.34066 2.93521 5.66322 3.25778C5.98579 3.58034 6.167 4.01783 6.167 4.474C6.167 4.93017 5.98579 5.36766 5.66322 5.69022C5.34066 6.01279 4.90317 6.194 4.447 6.194ZM5.931 17.044H2.961V7.5H5.931V17.044ZM18.522 0H1.476C0.66 0 0 0.645 0 1.44V18.56C0 19.355 0.66 20 1.476 20H18.518C19.333 20 20 19.356 20 18.56V1.44C20 0.646 19.333 0 18.518 0H18.522Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1177_1476">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </a>
              {/* youtube */}
              <a href="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M22.54 6.42C22.4151 5.95228 22.1698 5.52547 21.8285 5.1821C21.4872 4.83873 21.0619 4.59079 20.595 4.463C18.88 4 12 4 12 4C12 4 5.12 4 3.405 4.463C2.93806 4.59079 2.51276 4.83873 2.1715 5.1821C1.83023 5.52547 1.58492 5.95228 1.46 6.42C1 8.148 1 11.75 1 11.75C1 11.75 1 15.352 1.46 17.08C1.58476 17.5479 1.83001 17.9749 2.17129 18.3185C2.51256 18.662 2.93794 18.9101 3.405 19.038C5.121 19.5 12 19.5 12 19.5C12 19.5 18.88 19.5 20.595 19.038C21.0621 18.9101 21.4874 18.662 21.8287 18.3185C22.17 17.9749 22.4152 17.5479 22.54 17.08C23 15.354 23 11.75 23 11.75C23 11.75 23 8.148 22.54 6.42ZM9.75 8.479V15.021L15.5 11.75L9.75 8.479Z"
                    fill="black"
                  />
                </svg>
              </a>
              {/* instagram */}
              <a href="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M17.34 5.46C17.1027 5.46 16.8707 5.53038 16.6733 5.66224C16.476 5.79409 16.3222 5.98151 16.2313 6.20078C16.1405 6.42005 16.1168 6.66133 16.1631 6.89411C16.2094 7.12689 16.3236 7.34071 16.4915 7.50853C16.6593 7.67635 16.8731 7.79064 17.1059 7.83694C17.3387 7.88324 17.5799 7.85948 17.7992 7.76866C18.0185 7.67783 18.2059 7.52402 18.3378 7.32668C18.4696 7.12935 18.54 6.89734 18.54 6.66C18.54 6.34174 18.4136 6.03652 18.1885 5.81147C17.9635 5.58643 17.6583 5.46 17.34 5.46ZM21.94 7.88C21.9204 7.05032 21.765 6.22945 21.48 5.45C21.2269 4.78255 20.831 4.17846 20.32 3.68C19.8248 3.16743 19.2196 2.77418 18.55 2.53C17.7727 2.23616 16.9508 2.07721 16.12 2.06C15.06 2 14.72 2 12 2C9.28 2 8.94 2 7.88 2.06C7.04915 2.07721 6.22734 2.23616 5.45 2.53C4.78198 2.77725 4.17736 3.17008 3.68 3.68C3.16743 4.17518 2.77418 4.78044 2.53 5.45C2.23616 6.22734 2.07721 7.04915 2.06 7.88C2 8.94 2 9.28 2 12C2 14.72 2 15.06 2.06 16.12C2.07721 16.9508 2.23616 17.7727 2.53 18.55C2.77418 19.2196 3.16743 19.8248 3.68 20.32C4.17736 20.8299 4.78198 21.2227 5.45 21.47C6.22734 21.7638 7.04915 21.9228 7.88 21.94C8.94 22 9.28 22 12 22C14.72 22 15.06 22 16.12 21.94C16.9508 21.9228 17.7727 21.7638 18.55 21.47C19.2196 21.2258 19.8248 20.8326 20.32 20.32C20.8322 19.8226 21.2283 19.2182 21.48 18.55C21.765 17.7705 21.9204 16.9497 21.94 16.12C21.94 15.06 22 14.72 22 12C22 9.28 22 8.94 21.94 7.88ZM20.14 16C20.1329 16.6348 20.0179 17.2638 19.8 17.86C19.6403 18.2952 19.3839 18.6884 19.05 19.01C18.7254 19.3403 18.3331 19.5961 17.9 19.76C17.3038 19.9779 16.6748 20.0929 16.04 20.1C15.04 20.15 14.67 20.16 12.04 20.16C9.41 20.16 9.04 20.16 8.04 20.1C7.38085 20.1129 6.72445 20.0114 6.1 19.8C5.68619 19.6273 5.3119 19.3721 5 19.05C4.66809 18.7287 4.41484 18.3352 4.26 17.9C4.01505 17.2954 3.8796 16.652 3.86 16C3.86 15 3.8 14.63 3.8 12C3.8 9.37 3.8 9 3.86 8C3.86365 7.35098 3.98214 6.70772 4.21 6.1C4.38605 5.67791 4.65627 5.30166 5 5C5.30292 4.65519 5.67863 4.38195 6.1 4.2C6.7094 3.97948 7.35194 3.8645 8 3.86C9 3.86 9.37 3.8 12 3.8C14.63 3.8 15 3.8 16 3.86C16.6348 3.86709 17.2638 3.98206 17.86 4.2C18.3144 4.36865 18.7223 4.64285 19.05 5C19.3767 5.30802 19.6326 5.68334 19.8 6.1C20.0224 6.70888 20.1375 7.35176 20.14 8C20.19 9 20.2 9.37 20.2 12C20.2 14.63 20.19 15 20.14 16ZM12 6.87C10.9858 6.87198 9.99496 7.17453 9.15265 7.73942C8.31035 8.30431 7.65438 9.1062 7.26763 10.0438C6.88089 10.9813 6.78072 12.0125 6.97979 13.0069C7.17886 14.0014 7.66824 14.9145 8.38608 15.631C9.10392 16.3474 10.018 16.835 11.0129 17.0321C12.0077 17.2293 13.0387 17.1271 13.9755 16.7385C14.9123 16.35 15.7129 15.6924 16.2761 14.849C16.8394 14.0056 17.14 13.0142 17.14 12C17.1413 11.3251 17.0092 10.6566 16.7512 10.033C16.4933 9.40931 16.1146 8.84281 15.6369 8.36605C15.1592 7.88929 14.5919 7.51168 13.9678 7.25493C13.3436 6.99818 12.6749 6.86736 12 6.87ZM12 15.33C11.3414 15.33 10.6976 15.1347 10.15 14.7688C9.60234 14.4029 9.17552 13.8828 8.92348 13.2743C8.67144 12.6659 8.6055 11.9963 8.73398 11.3503C8.86247 10.7044 9.17963 10.111 9.64533 9.64533C10.111 9.17963 10.7044 8.86247 11.3503 8.73398C11.9963 8.6055 12.6659 8.67144 13.2743 8.92348C13.8828 9.17552 14.4029 9.60234 14.7688 10.15C15.1347 10.6976 15.33 11.3414 15.33 12C15.33 12.4373 15.2439 12.8703 15.0765 13.2743C14.9092 13.6784 14.6639 14.0454 14.3547 14.3547C14.0454 14.6639 13.6784 14.9092 13.2743 15.0765C12.8703 15.2439 12.4373 15.33 12 15.33Z"
                    fill="black"
                  />
                </svg>
              </a>
            </span>
          </span>
        </div>

        {/* Car For Sell col 1 */}
        <div className="col-span-3 md:col-span-3 md:px-3 pl-4">
          <h4 className="text-sm md:text-md font-semibold text-gray-900 mb-2">
            Car for Sale
          </h4>
          <ul className="space-y-[6px] text-[10px] md:text-[10px] font-semibold text-gray-700 xl:text-xs">
            {carForSaleCities.map((cities, index) => (
              <li key={index}>
                <a href={cities.link} className="hover:underline">
                  Car for sale in {cities.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Car For Sell col 2 */}
        <div className="col-span-3 mt-6 md:pl-10 pr-4">
          <ul className="space-y-[6px] text-[10px] md:text-[10px] font-semibold text-gray-700 xl:text-xs">
            {carForSaleCities2.map((cities, index) => (
              <li key={index}>
                <a href={cities.link} className="hover:underline">
                  Car for sale in {cities.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-6 md:col-span-3 md:mt-6 md:pl-16 px-4">
          <h4 className="block md:hidden text-sm md:text-md font-semibold text-gray-900 mb-2">
            Company
          </h4>
          <ul className="hidden md:block space-y-[6px] text-[10px] md:text-[10px] font-semibold text-gray-700 xl:text-xs">
            {linksData.map((link, index) => (
              <li key={index}>
                <a href={link.link} className="hover:underline">
                  {link.page}
                </a>
              </li>
            ))}
          </ul>

          <span className="grid grid-cols-2 md:hidden justify-between gap-4 mb-3">
            {/* Left side - 3 links */}
            <ul className="space-y-[6px] text-[10px] md:text-[10px] font-semibold text-gray-700 xl:text-xs">
              {linksData.slice(0, 3).map((link, index) => (
                <li key={index}>
                  <a href={link.link} className="hover:underline">
                    {link.page}
                  </a>
                </li>
              ))}
            </ul>

            {/* Right side - 2 links */}
            <ul className="space-y-[6px] text-[10px] md:text-[10px] font-semibold text-gray-700 xl:text-xs">
              {linksData.slice(3, 5).map((link, index) => (
                <li key={index}>
                  <a href={link.link} className="hover:underline">
                    {link.page}
                  </a>
                </li>
              ))}
            </ul>
          </span>

          <p className="flex md:hidden items-center justify-center gap-2 text-gray-800 text-[9px]">
            <Copyright className="h-3 w-3" /> Copyright{" "}
            {new Date().getFullYear()} | All Rights Reserved
          </p>
        </div>

        {/* Newsletter */}
        <div className="col-span-6 md:col-span-4 bg-[#CBCBCB] md:rounded-md p-3 space-y-1 md:ml-12 px-4 md:px-2 pb-10 md:pb-3">
          <img src="/Brand-logo.png" alt="Dhikkar-logo" className="h-4 w-fit" />
          <h4 className="text-[9px] font-semibold">Found Car in you City</h4>
          <p className="text-[8px] tracking-tight leading-2.5">
            Dhikcar is India’s fastest growing technology enabled cars
            brokerage. Our mission is to make people happy what they want to
            ride and ride what they want.
          </p>
          <a
            href=""
            className="text-[9px] text-black flex items-center font-semibold gap-1 mt-2"
          >
            Start Exploring{" "}
            <span>
              <ChevronRight className="h-3 w-3 text-black group-hover:ml-2 transition-all duration-500 cursor-pointer" />
            </span>
          </a>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="text-sm font-semibold text-center md:text-left hidden md:flex flex-col md:flex-row items-center justify-between py-4 max-w-7xl mx-auto gap-2">
        <p className="flex items-center gap-2 text-gray-800 text-[13px]">
          <Copyright className="h-4 w-4" /> Copyright {new Date().getFullYear()}{" "}
          | All Rights Reserved
        </p>
        <span className="flex gap-10 text-gray-800 text-[13px]">
          Contact With Us :
          <span className="flex gap-7 items-center ">
            {/* facebook */}
            <a href="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47 14 5.5 16 5.5H17.5V2.14C17.174 2.097 15.943 2 14.643 2C11.928 2 10 3.657 10 6.7V9.5H7V13.5H10V22H14V13.5Z"
                  fill="black"
                />
              </svg>
            </a>
            {/* linkedin */}
            <a href="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
              >
                <g clipPath="url(#clip0_1177_1476)">
                  <path
                    d="M17.04 17.043H14.078V12.403C14.078 11.296 14.055 9.872 12.534 9.872C10.99 9.872 10.754 11.076 10.754 12.321V17.043H7.793V7.5H10.637V8.8H10.676C11.073 8.05 12.04 7.26 13.484 7.26C16.485 7.26 17.04 9.234 17.04 11.805V17.043ZM4.447 6.194C3.493 6.194 2.727 5.423 2.727 4.474C2.727 3.525 3.494 2.754 4.447 2.754C4.90317 2.754 5.34066 2.93521 5.66322 3.25778C5.98579 3.58034 6.167 4.01783 6.167 4.474C6.167 4.93017 5.98579 5.36766 5.66322 5.69022C5.34066 6.01279 4.90317 6.194 4.447 6.194ZM5.931 17.044H2.961V7.5H5.931V17.044ZM18.522 0H1.476C0.66 0 0 0.645 0 1.44V18.56C0 19.355 0.66 20 1.476 20H18.518C19.333 20 20 19.356 20 18.56V1.44C20 0.646 19.333 0 18.518 0H18.522Z"
                    fill="black"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1177_1476">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </a>
            {/* youtube */}
            <a href="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M22.54 6.42C22.4151 5.95228 22.1698 5.52547 21.8285 5.1821C21.4872 4.83873 21.0619 4.59079 20.595 4.463C18.88 4 12 4 12 4C12 4 5.12 4 3.405 4.463C2.93806 4.59079 2.51276 4.83873 2.1715 5.1821C1.83023 5.52547 1.58492 5.95228 1.46 6.42C1 8.148 1 11.75 1 11.75C1 11.75 1 15.352 1.46 17.08C1.58476 17.5479 1.83001 17.9749 2.17129 18.3185C2.51256 18.662 2.93794 18.9101 3.405 19.038C5.121 19.5 12 19.5 12 19.5C12 19.5 18.88 19.5 20.595 19.038C21.0621 18.9101 21.4874 18.662 21.8287 18.3185C22.17 17.9749 22.4152 17.5479 22.54 17.08C23 15.354 23 11.75 23 11.75C23 11.75 23 8.148 22.54 6.42ZM9.75 8.479V15.021L15.5 11.75L9.75 8.479Z"
                  fill="black"
                />
              </svg>
            </a>
            {/* instagram */}
            <a href="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M17.34 5.46C17.1027 5.46 16.8707 5.53038 16.6733 5.66224C16.476 5.79409 16.3222 5.98151 16.2313 6.20078C16.1405 6.42005 16.1168 6.66133 16.1631 6.89411C16.2094 7.12689 16.3236 7.34071 16.4915 7.50853C16.6593 7.67635 16.8731 7.79064 17.1059 7.83694C17.3387 7.88324 17.5799 7.85948 17.7992 7.76866C18.0185 7.67783 18.2059 7.52402 18.3378 7.32668C18.4696 7.12935 18.54 6.89734 18.54 6.66C18.54 6.34174 18.4136 6.03652 18.1885 5.81147C17.9635 5.58643 17.6583 5.46 17.34 5.46ZM21.94 7.88C21.9204 7.05032 21.765 6.22945 21.48 5.45C21.2269 4.78255 20.831 4.17846 20.32 3.68C19.8248 3.16743 19.2196 2.77418 18.55 2.53C17.7727 2.23616 16.9508 2.07721 16.12 2.06C15.06 2 14.72 2 12 2C9.28 2 8.94 2 7.88 2.06C7.04915 2.07721 6.22734 2.23616 5.45 2.53C4.78198 2.77725 4.17736 3.17008 3.68 3.68C3.16743 4.17518 2.77418 4.78044 2.53 5.45C2.23616 6.22734 2.07721 7.04915 2.06 7.88C2 8.94 2 9.28 2 12C2 14.72 2 15.06 2.06 16.12C2.07721 16.9508 2.23616 17.7727 2.53 18.55C2.77418 19.2196 3.16743 19.8248 3.68 20.32C4.17736 20.8299 4.78198 21.2227 5.45 21.47C6.22734 21.7638 7.04915 21.9228 7.88 21.94C8.94 22 9.28 22 12 22C14.72 22 15.06 22 16.12 21.94C16.9508 21.9228 17.7727 21.7638 18.55 21.47C19.2196 21.2258 19.8248 20.8326 20.32 20.32C20.8322 19.8226 21.2283 19.2182 21.48 18.55C21.765 17.7705 21.9204 16.9497 21.94 16.12C21.94 15.06 22 14.72 22 12C22 9.28 22 8.94 21.94 7.88ZM20.14 16C20.1329 16.6348 20.0179 17.2638 19.8 17.86C19.6403 18.2952 19.3839 18.6884 19.05 19.01C18.7254 19.3403 18.3331 19.5961 17.9 19.76C17.3038 19.9779 16.6748 20.0929 16.04 20.1C15.04 20.15 14.67 20.16 12.04 20.16C9.41 20.16 9.04 20.16 8.04 20.1C7.38085 20.1129 6.72445 20.0114 6.1 19.8C5.68619 19.6273 5.3119 19.3721 5 19.05C4.66809 18.7287 4.41484 18.3352 4.26 17.9C4.01505 17.2954 3.8796 16.652 3.86 16C3.86 15 3.8 14.63 3.8 12C3.8 9.37 3.8 9 3.86 8C3.86365 7.35098 3.98214 6.70772 4.21 6.1C4.38605 5.67791 4.65627 5.30166 5 5C5.30292 4.65519 5.67863 4.38195 6.1 4.2C6.7094 3.97948 7.35194 3.8645 8 3.86C9 3.86 9.37 3.8 12 3.8C14.63 3.8 15 3.8 16 3.86C16.6348 3.86709 17.2638 3.98206 17.86 4.2C18.3144 4.36865 18.7223 4.64285 19.05 5C19.3767 5.30802 19.6326 5.68334 19.8 6.1C20.0224 6.70888 20.1375 7.35176 20.14 8C20.19 9 20.2 9.37 20.2 12C20.2 14.63 20.19 15 20.14 16ZM12 6.87C10.9858 6.87198 9.99496 7.17453 9.15265 7.73942C8.31035 8.30431 7.65438 9.1062 7.26763 10.0438C6.88089 10.9813 6.78072 12.0125 6.97979 13.0069C7.17886 14.0014 7.66824 14.9145 8.38608 15.631C9.10392 16.3474 10.018 16.835 11.0129 17.0321C12.0077 17.2293 13.0387 17.1271 13.9755 16.7385C14.9123 16.35 15.7129 15.6924 16.2761 14.849C16.8394 14.0056 17.14 13.0142 17.14 12C17.1413 11.3251 17.0092 10.6566 16.7512 10.033C16.4933 9.40931 16.1146 8.84281 15.6369 8.36605C15.1592 7.88929 14.5919 7.51168 13.9678 7.25493C13.3436 6.99818 12.6749 6.86736 12 6.87ZM12 15.33C11.3414 15.33 10.6976 15.1347 10.15 14.7688C9.60234 14.4029 9.17552 13.8828 8.92348 13.2743C8.67144 12.6659 8.6055 11.9963 8.73398 11.3503C8.86247 10.7044 9.17963 10.111 9.64533 9.64533C10.111 9.17963 10.7044 8.86247 11.3503 8.73398C11.9963 8.6055 12.6659 8.67144 13.2743 8.92348C13.8828 9.17552 14.4029 9.60234 14.7688 10.15C15.1347 10.6976 15.33 11.3414 15.33 12C15.33 12.4373 15.2439 12.8703 15.0765 13.2743C14.9092 13.6784 14.6639 14.0454 14.3547 14.3547C14.0454 14.6639 13.6784 14.9092 13.2743 15.0765C12.8703 15.2439 12.4373 15.33 12 15.33Z"
                  fill="black"
                />
              </svg>
            </a>
          </span>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
