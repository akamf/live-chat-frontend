import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-4 text-center text-sm text-gray-500 flex justify-center items-center gap-1">
        &copy; {new Date().getFullYear()} ChatApp — Built by{" "}
        <a
          href="https://github.com/akamf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-gray-600 hover:text-black"
        >
          <FaGithub className="text-base" />
          akamf
        </a>
      </div>
    </footer>
  );
};

export default Footer;
