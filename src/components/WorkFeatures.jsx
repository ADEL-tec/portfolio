function WorkFeatures({ features }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 lg:px-12">
      <div className="text-center">
        <p className="font-medium text-purple-400 px-10 py-1.5 rounded-full bg-purple-950 border border-purple-800 w-max mx-auto">
          Features
        </p>
        <h2 className="text-3xl font-semibold mt-4">Built for builders</h2>
        <p className="mt-2 text-slate dark:text-white/80 max-w-xl mx-auto">
          Components, patterns and pages — everything you need to ship.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-4 mt-10 px-6">
        {features?.map((feature, index) => (
          <div
            key={index}
            className={
              index % 2 === 0
                ? "p-px rounded-[13px] bg-gradient-to-br from-[#9544FF] to-[#223B60]"
                : ""
            }
          >
            <div className="p-6 rounded-xl space-y-3  border  dark:border-slate-800 dark:bg-slate-900 bg-white max-w-80 w-full hover:-translate-y-0.5 transition duration-300">
              {/* If icon is JSX */}
              {feature.icon}

              <h3 className="text-base font-medium text-white">
                {feature.title}
              </h3>

              <p className="text-slate-400 line-clamp-3 pb-4">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkFeatures;
