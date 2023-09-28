"use client";

import { useRouter } from "next/navigation";

export default function Back() {
  const router = useRouter();

  return (
    <div className="w-full h-12 sticky z-50 top-0 inset-x-0 py-1 font-medium text-lg  backdrop-filter backdrop-blur-xl bg-opacity-80 sm:hidden">
      <div className="container h-full px-5 md:px-10">
        <div
          className="-ml-2 w-fit h-full hover:cursor-pointer flex items-center"
          onClick={() => router.back()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          <p className="text-sm">Back</p>
        </div>
      </div>
    </div>
  );
}
