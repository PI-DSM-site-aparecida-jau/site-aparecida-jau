import whatsapp_circle from "./../assets/img/logo/whatsapp-circle.png";

export default function WhatsAppButton() {

  const whatsappUrl = `https://chat.whatsapp.com/EvxJksmUdIYDxzw5fUI99E`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Entre em contato pelo WhatsApp"
      className="fixed bottom-[50px] left-[50px] z-50 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#20D366] text-white shadow-md transition-transform hover:scale-110"
    >
      <img src={whatsapp_circle} />
    </a>
  );
}