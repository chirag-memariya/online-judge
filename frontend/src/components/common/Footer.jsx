import React from 'react'

const Footer = () => {
  return (

<footer className="bg-white shadow dark:bg-gray-900 relative">
  <div className="w-full max-w-screen-xl p-4 md:py-4 flex items-center justify-between">
    <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
      <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
      <span className="title self-center text-2xl font-semibold whitespace-nowrap dark:text-white">CodeThrone</span>
    </a>
    <p className="absolute left-0 right-0 text-center text-indigo-300 text-sm mx-auto">
      © 2024 CodeThrone. All rights reserved.
    </p>
  </div>
</footer>



  )
}

export default Footer