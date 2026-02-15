export default function ServiceHeader({ name, icon, description, id }) {
  console.log(name, icon, description, id);
  return (
    <div className="w-11/12 max-w-3xl text-center mx-auto h-screen flex flex-col items-center justify-center gap-4">
      <img src={icon} alt="" className="w-28" />
      <h1 className="text-3xl sm:text-6xl lg:text-[66px] font-Ovo">{name} </h1>
      <p className="max-w-2xl mx-auto font-Ovo">{description}</p>

      <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
        <a
          href="#contact"
          className="px-10 py-2.5 border rounded-full bg-gradient-to-r from-[#b820e6] to-[#da7d20] text-white flex items-center gap-2 dark:border-transparent"
        >
          My Projects{" "}
          <img src="assets/right-arrow-white.png" alt="" className="w-4" />
        </a>
      </div>
    </div>
  );
}
