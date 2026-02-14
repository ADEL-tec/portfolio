import { AppStoreButton } from "./AppStoreButton";
import { GooglePlayButton } from "./GooglePlayButton";

export default function WorkHeader({
  name,
  cover,
  logo,
  description,
  id,
  APKUrl,
  IOSUrl,
}) {
  return (
    <div
      className="relative h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${cover})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/60 dark:bg-black/60   z-0"></div>
      {/* Content */}
      <div className="relative w-11/12 max-w-3xl text-center mx-auto h-screen flex flex-col items-center justify-center gap-4">
        <img src={logo} alt="" className="rounded-full w-32 bg-white p-4" />
        <h1 className="text-3xl sm:text-6xl lg:text-[66px] font-Ovo">{name}</h1>
        <p className="max-w-2xl mx-auto font-Ovo">{description}</p>
        <div className="flex gap-4 mt-6">
          {APKUrl && <GooglePlayButton outline link={APKUrl} />}
          {IOSUrl && <AppStoreButton outline link={IOSUrl} />}
        </div>
      </div>
    </div>
  );
}
