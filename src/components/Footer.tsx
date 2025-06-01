import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-4 text-sm text-gray-500 dark:text-gray-400 flex justify-center items-center flex-wrap gap-1">
        &copy; {new Date().getFullYear()} ChatApp — Built by{" "}
        <a
          href="https://github.com/akamf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
        >
          <FaGithub className="text-base" />
          akamf
        </a>
      </div>
    </footer>
  );
};

export default Footer;
