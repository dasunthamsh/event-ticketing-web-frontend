import React from 'react';

const Hero = () => {
    return (
        <div className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-black/20">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left content */}
                    <div className="flex flex-col space-y-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold  ">
                                Discover Amazing Events
                            </h1>
                            <p className="mt-4 text-lg md:text-xl text-blue-100 max-w-lg font-poppins">
                                Concerts, theatre, cultural events and more. Book your tickets online with secure payments and instant confirmation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
