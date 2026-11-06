import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Stats from "@/components/Stats";
import SystemMap from "@/components/SystemMap";
import Journey from "@/components/Journey";
import Tagline from "@/components/Tagline";
import About from "@/components/About";
import Terminal from "@/components/Terminal";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Preloader />
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <Stats />
        <SystemMap />
        <Tagline />
        <Journey />
        <About />
        <Terminal />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
