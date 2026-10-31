import youtube_circle from "./../assets/img/logo/youtube-circle.png";
import facebook_circle from "./../assets/img/logo/facebook-circle.png";
import instagram_circle from "./../assets/img/logo/instagram-circle.png";
import whatsapp_circle from "./../assets/img/logo/whatsapp-circle.png";
import { href } from "react-router-dom";

export const medias = {
    youtube: { id: "youtube", src: youtube_circle, alt: "Youtube logo", href: "https://www.youtube.com/@AparecidaJauSP" },
    facebook: { id: "facebook", src: facebook_circle, alt: "Facebook logo", href: "https://www.facebook.com/nsaparecidajahu" },
    instagram: { id: "instagram", src: instagram_circle, alt: "Instagram logo", href: "https://www.instagram.com/aparecidajau/" },
    whatsapp: { id: "whatsapp", src: whatsapp_circle, alt: "Whatsapp logo", href: "https://chat.whatsapp.com/EvxJksmUdIYDxzw5fUI99E" }
}

export const mediasIcons = [
    medias.youtube,
    medias.facebook,
    medias.instagram,
    medias.whatsapp
]