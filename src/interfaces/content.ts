import { ICarousels } from "./carousels";
import { IMenus } from "./menus"
import { IGrid } from "./grid"

export interface IContent {
    id: String,
    carousels: Array<ICarousels>
    about_title: String,
    about_text: String,
    menus: Array<IMenus>
    grid: Array<IGrid>
    image_one: String,
    image_two: String,
    image_three: String,
    image_four: String,
    image_five: String,
    image_six: String,
    reservation_title: String,
    reservation_text: String,
    breakfast_timing_day_one: String,
    breakfast_timing_hours_one: String,
    breakfast_timing_day_two: String,
    breakfast_timing_hours_two: String,
    lunch_timing_day_one: String,
    lunch_timing_hours_one: String,
    lunch_timing_day_two: String,
    lunch_timing_hours_two: String,
    dinner_timing_day_one: String,
    dinner_timing_hours_one: String,
    dinner_timing_day_two: String,
    dinner_timing_hours_two: String,
    reservation_line_one: String,
    reservation_line_two: String,
    phone: String,
    email: String,
    contact_title: String,
    contact_adress_one: String,
    contact_adress_two: String,
    contact_opening_day_one: String,
    contact_opening_hours_one: String,
    contact_opening_day_two: String,
    contact_opening_hours_two: String,
    contact_opening_day_three: String,
    contact_opening_hours_three: String,
    map: String,
}