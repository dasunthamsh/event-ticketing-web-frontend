import Image from "next/image";
import React from "react";
import Main from "@/Components/common/Main";
import Header from "@/Components/common/Header";
import Footer from "@/Components/common/Footer";

export default function Home() {
  return (
      <>
          <Header/>
            <Main/>
          <div className='relative '>
            <Footer/>
          </div>
      </>
  );
}
