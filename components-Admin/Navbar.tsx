import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800 dark:text-white">
          Alwaki Admin
        </Link>
        <div className="flex gap-4">
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
          <Link href="/signup" className="text-green-500 hover:underline">
            Signup
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;