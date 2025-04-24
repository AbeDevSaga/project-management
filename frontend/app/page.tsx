"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import Navbar from "./landing-page-comp/Navbar";
import Hero from "./landing-page-comp/Hero";
import About from "./landing-page-comp/About"; // Prepare for future sections
import CallToAction from "./landing-page-comp/CallToAction";
import Features from "./landing-page-comp/Features";
import HowItWorks from "./landing-page-comp/HowItWorks";
import RoleBased from "./landing-page-comp/RoleBased";
import Testimonial from "./landing-page-comp/Testimonal";
import Footer from "./landing-page-comp/Footer";

const LandingPage: React.FC = () => {
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.token !== null
  );

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Features />
        <HowItWorks />
        <RoleBased />
        <Testimonial />
        <CallToAction/>
        <Footer/>
      </main>
    </div>
  );
};

export default LandingPage;
