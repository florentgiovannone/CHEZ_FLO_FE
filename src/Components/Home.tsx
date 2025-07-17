import { HeroCarousel } from "./HeroCarousel";
import About from "./About";
import Menus from "./Menus";
import GridGallery from "./GridGallery";
import Reservation from "./Reservations";
import ContactUs from "./ContactUs";
import { IContent } from "../interfaces/content";
import { IMenus } from "../interfaces/menus";
import { ICarousels } from "../interfaces/carousels";
import { IGrid } from "../interfaces/grid";

interface ContentProps {
  content: null | IContent;
  setContent: Function;
  menus: IMenus[];
  menusId: string;
  menusType: string;
  menusText: string;
  menusUrl: string;
  setMenus: Function;
  carousels: ICarousels[];
  setCarousels: Function;
  grid: IGrid[];
  setGrid: Function;
}



const Home = ({ content, setContent, menus, grid, setGrid }: ContentProps) => {

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
      <Menus menus={menus} setContent={setContent} />
      <GridGallery grid={grid} setGrid={setGrid} />
      <Reservation setContent={setContent} content={content} />
      <ContactUs setContent={setContent} content={content} />
    </>
  );
};

export default Home; 