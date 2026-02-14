function TechnologiesUsed({ technologies }) {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-6 lg:px-12">
      <div className="text-center">
        <p className="font-medium text-purple-400 px-6 py-1.5 rounded-full bg-purple-950 border border-purple-800 w-max mx-auto">
          Stack
        </p>
        <h2 className="text-3xl font-semibold mt-4 dark:text-white">
          Technologies Used
        </h2>
        <p className="mt-2 text-slate dark:text-white/80 max-w-xl mx-auto">
          Core technologies and tools used to design, develop, and deploy this
          project.
        </p>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-6">
        {technologies?.map((tech, index) => (
          <div
            key={index}
            className="w-40 flex flex-col items-center justify-center p-6 rounded-xl border border-slate-200 bg-white  dark:border-slate-800 dark:bg-slate-900 hover:-translate-y-1 transition duration-300"
          >
            {tech.icon && (
              <div className="text-purple-500 mb-3">{tech.icon}</div>
            )}
            <p className="text-sm dark:text-slate-300 text-center">
              {tech.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TechnologiesUsed;
