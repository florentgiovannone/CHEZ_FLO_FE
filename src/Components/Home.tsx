import { HeroCarousel } from "./HeroCarousel";
import About from "./About";
import Menus from "./Menus";
import GridGallery from "./GridGallery";
import Reservation from "./Reservations";
import ContactUs from "./ContactUs";
import { IContent } from "../interfaces/content";

interface ContentProps {
  content: null | IContent;
  setContent: Function;
}

const Home = ({ content, setContent }: ContentProps) => {

  function slideMap() {
    return content?.carousels?.map((item) => item.carousel_url.toString()) || [];
  }

  let slides: string[] = slideMap();

  return (
    <>
      <div className="w-[100%] pb-10 m-auto -mt-32">
        <HeroCarousel slides={slides} />
      </div>
      <About setContent={setContent} content={content} />
      <Menus setContent={setContent} content={content} />
      <GridGallery setContent={setContent} content={content} />
      <Reservation setContent={setContent} content={content} />
      <ContactUs setContent={setContent} content={content} />
    </>
  );
};

export default Home; 