import { useState } from "react";
import { Link } from "react-router-dom";

import logo_aparecida from "./../assets/img/logo/logo-aparecida.png";
import facebook_circle from "./../assets/img/logo/facebook-circle.png";
import instagram_circle from "./../assets/img/logo/instagram-circle.png";
import youtube_circle from "./../assets/img/logo/youtube-circle.png";

const Navbar = () => {

  const [menuMobile, setMenuMobile] = useState(false);

  return (

    <header className='flex flex-col items-center'>

      {/* ========================= */}
      {/* DESKTOP */}
      {/* ========================= */}

      <div className="hidden lg:flex flex-col items-center w-full">

        {/* LOGO */}

        <Link to="/">
          <img
            className="w-[271px] py-[14px]"
            src={logo_aparecida}
            alt="Logo Paróquia Nossa Senhora Aparecida"
          />
        </Link>

        {/* MENU */}

        <div className='w-full h-[60px] border-1 border-[#D9D9D9] border-bottom flex items-center justify-center relative'>

          <nav>

            <ul className='flex items-center gap-[30px] list-none'>

              <li className='text-[12px] font-bold'>
                <Link to="/">Início</Link>
              </li>

              <li className='text-[12px] font-bold'>
                <Link to="/paroquia">Paróquia</Link>
              </li>              

              <li className='text-[12px] font-bold'>
                <Link to="/noticias">Notícias</Link>
              </li>

              <li className='text-[12px] font-bold'>
                <Link to="/boletim-informativo">Boletim Informativo</Link>
              </li>

              <li className='text-[12px] font-bold'>
                <Link to="/contato">Contato</Link>
              </li>

            </ul>

          </nav>

          {/* REDES SOCIAIS */}

          <div className='flex items-center gap-[12px] absolute right-[100px]'>

            <a
              href="https://www.youtube.com/@AparecidaJauSP"
              target='_blank'
              rel="noreferrer"
            >
              <img className='w-[23px]' src={youtube_circle} alt="" />
            </a>

            <a
              href="https://www.facebook.com/nsaparecidajahu"
              target='_blank'
              rel="noreferrer"
            >
              <img className='w-[23px]' src={facebook_circle} alt="" />
            </a>

            <a
              href="https://www.instagram.com/aparecidajau/"
              target='_blank'
              rel="noreferrer"
            >
              <img className='w-[23px]' src={instagram_circle} alt="" />
            </a>            

            <Link
              to="/login"
              className='flex justify-center items-center bg-[#034389] w-[100px] h-[30px] text-[#fff] rounded-[20px]'
            >
              Login
            </Link>

          </div>

        </div>

      </div>

      {/* ========================= */}
      {/* MOBILE */}
      {/* ========================= */}

      <div className="lg:hidden w-full flex justify-between items-center px-[20px]">

        {/* LOGO */}

        <Link to="/">
          <img
            className="w-[180px]"
            src={logo_aparecida}
            alt="Logo Paróquia Nossa Senhora Aparecida"
          />
        </Link>

        {/* BOTÃO HAMBURGUER */}

        <button
          onClick={() => setMenuMobile(!menuMobile)}
          className="flex flex-col gap-[5px]"
        >

          <span className="w-[28px] h-[3px] bg-[#034389] rounded-full"></span>
          <span className="w-[28px] h-[3px] bg-[#034389] rounded-full"></span>
          <span className="w-[28px] h-[3px] bg-[#034389] rounded-full"></span>

        </button>

      </div>

      {/* MENU MOBILE */}

      {menuMobile && (

        <div className='lg:hidden w-full mt-[15px] px-[20px]'>

          <nav className='flex flex-col gap-[15px]'>

            <Link
              to="/"
              onClick={() => setMenuMobile(false)}
            >
              Início
            </Link>

            <Link
              to="/paroquia"
              onClick={() => setMenuMobile(false)}
            >
              Paróquia
            </Link>            

            <Link
              to="/noticias"
              onClick={() => setMenuMobile(false)}
            >
              Notícias
            </Link>

            <Link
              to="/boletim-informativo"
              onClick={() => setMenuMobile(false)}
            >
              Boletim Informativo
            </Link>

            <Link
              to="/contato"
              onClick={() => setMenuMobile(false)}
            >
              Contato
            </Link>

            {/* REDES MOBILE */}

            <div className='flex items-center gap-[12px] pt-[10px]'>

              <a
                href="https://www.youtube.com/@AparecidaJauSP"
                target='_blank'
                rel="noreferrer"
              >
                <img className='w-[30px]' src={youtube_circle} alt="" />
              </a>

              <a
                href="https://www.facebook.com/nsaparecidajahu"
                target='_blank'
                rel="noreferrer"
              >
                <img className='w-[30px]' src={facebook_circle} alt="" />
              </a>

              <a
                href="https://www.instagram.com/aparecidajau/"
                target='_blank'
                rel="noreferrer"
              >
                <img className='w-[35px]' src={instagram_circle} alt="" />
              </a>              

            </div>

            <Link
              to="/login"
              onClick={() => setMenuMobile(false)}
              className='flex justify-center items-center bg-[#034389] w-[120px] h-[35px] text-[#fff] rounded-[20px] mt-[10px]'
            >
              Área ADM
            </Link>

          </nav>

        </div>

      )}

    </header>

  );

};

export default Navbar;