export default function Footer() {
  return (
    <div className="mt-20">
      <div className="text-center">
        <a href="#!">
          <img
            src="/assets/logo.png"
            alt=""
            className="w-36 mx-auto mb-2 dark:hidden"
          />
          <img
            src="/assets/logo_dark.png"
            alt=""
            className="w-36 mx-auto mb-2 hidden dark:block"
          />
        </a>

        <div className="w-max flex items-center gap-2 mx-auto">
          <img src="/assets/mail_icon.png" alt="" className="w-5 dark:hidden" />
          <img
            src="/assets/mail_icon_dark.png"
            alt=""
            className="w-5 hidden dark:block"
          />

          <a href="mailto:meriouaadel22@gmail.com">meriouaadel22@gmail.com</a>
        </div>
      </div>
      <div className="text-center sm:flex items-center justify-between border-t border-gray-400 mx-[10%] mt-12 py-3">
        <p>
          © {new Date().getFullYear()}{" "}
          <a href="https://prebuiltui.com" target="_blank">
            PrebuiltUI
          </a>{" "}
          • Distributed by{" "}
          <a href="#" target="_blank">
            Adel Tech
          </a>{" "}
          • All rights reserved.
        </p>
        <ul className="flex items-center gap-10 justify-center mt-4 sm:mt-0">
          <li>
            <a href="https://github.com/ADEL-tec">GitHub</a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/adel-labdelli-merioua-1a4219209">
              LinkedIn
            </a>
          </li>
          <li>
            <a href="https://x.com/AdelMerioua">Twitter</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
