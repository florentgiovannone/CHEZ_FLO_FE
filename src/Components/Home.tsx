
import { HeroCarousel } from "./HeroCarousel"
import About from "./About"
import Menus from "./Menus"
import GridGallery from "./GridGallery"
import Reservation from "./Reservations"
import ContactUs from "./ContactUs"

function App() {
    let slides = [
        "https://media.houseandgarden.co.uk/photos/6548bac4ae920bdd9a97b4d2/16:9/w_2580,c_limit/Restaurant%20Interior%20(Credit%20Ben%20Carpenter).jpg",
        "https://www.thisisamber.co.uk/wp-content/uploads/2018/02/160-amb-23-2r-203-1-1600x708.jpg",
        "https://www.claridges.co.uk/siteassets/restaurants--bars/claridges-restaurant/new-2023/claridges-restaurant-hero-1920_720.jpg",
    ]

    return (
        <>
                    <div className="w-[75%] py-16 m-auto">
                        <HeroCarousel slides={slides} />
                    </div>
                    <About />
                    <Menus />
                    <GridGallery />
                    <Reservation />
                    <ContactUs />
        </>
    )
}

export default App