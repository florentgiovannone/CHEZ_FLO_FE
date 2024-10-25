
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Nav from "./Components/Nav"
import { HeroCarousel } from "./Components/HeroCarousel"
import About from "./Components/About"
import Menus from "./Components/Menus"
import GridGallery from "./Components/GridGallery"
import Reservation from "./Components/Reservations"
import ContactUs from "./Components/ContactUs"
import Footer from "./Components/Footer"
function App() {
  let slides = [
    "https://media.houseandgarden.co.uk/photos/6548bac4ae920bdd9a97b4d2/16:9/w_2580,c_limit/Restaurant%20Interior%20(Credit%20Ben%20Carpenter).jpg",
    "https://www.thisisamber.co.uk/wp-content/uploads/2018/02/160-amb-23-2r-203-1-1600x708.jpg",
    "https://www.claridges.co.uk/siteassets/restaurants--bars/claridges-restaurant/new-2023/claridges-restaurant-hero-1920_720.jpg",
  ]

return(
  <>
    <Nav />

    <div className="w-[75%] py-16 m-auto">
      <HeroCarousel slides={slides} />
    </div>
    <About/>
    <Menus/>
    <GridGallery />
    <Reservation/>
    
    <ContactUs />
    <Footer/>

  </>
)
}

export default App
