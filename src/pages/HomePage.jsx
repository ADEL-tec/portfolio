import About from "../components/About";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Services from "../components/Services";
import Work from "../components/Work";

export default function HomePage() {
  return (
    <>
      <Header />
      <About />
      <Services />
      <Work />
      <Contact />
    </>
  );
}
