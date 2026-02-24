import { Suspense, lazy, Fragment } from "react";
import logo from "../../assets/mohit55.png";
import profile from "../../assets/mohitoo.jpg";
// import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

// Lazy load headlessui components
const Disclosure = lazy(() =>
  import("@headlessui/react").then((module) => ({ default: module.Disclosure }))
);
const DisclosureButton = lazy(() =>
  import("@headlessui/react").then((module) => ({
    default: module.DisclosureButton,
  }))
);
const DisclosurePanel = lazy(() =>
  import("@headlessui/react").then((module) => ({
    default: module.DisclosurePanel,
  }))
);
const Menu = lazy(() =>
  import("@headlessui/react").then((module) => ({ default: module.Menu }))
);
const MenuButton = lazy(() =>
  import("@headlessui/react").then((module) => ({ default: module.MenuButton }))
);
const Transition = lazy(() =>
  import("@headlessui/react").then((module) => ({ default: module.Transition }))
);

// Lazy load icons
const Bars3Icon = lazy(() =>
  import("@heroicons/react/24/outline").then((module) => ({
    default: module.Bars3Icon,
  }))
);
const XMarkIcon = lazy(() =>
  import("@heroicons/react/24/outline").then((module) => ({
    default: module.XMarkIcon,
  }))
);

const navigation = [
  { name: "Home", href: "#home", current: true },
  { name: "About", href: "#about", current: false },
  { name: "Services", href: "#services", current: false },
  { name: "Projects", href: "#mywork", current: false },
  { name: "Contact", href: "#contact", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navigation() {
  const handleScroll = (href, close) => {
    close();
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else if (href === "#home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <Suspense fallback={<div className="h-16 bg-stone-950"></div>}>
      <Disclosure as="nav" className="bg-stone-950">
        {({ open, close }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-5 flex items-center sm:hidden">
                  <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    <Suspense fallback={<div className="size-6" />}>
                      <Bars3Icon
                        aria-hidden="true"
                        className="block size-6 group-data-open:hidden"
                      />
                      <XMarkIcon
                        aria-hidden="true"
                        className="hidden size-6 group-data-open:block"
                      />
                    </Suspense>
                  </DisclosureButton>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-evenly">
                  <div className="flex shrink-0 items-center">
                    <button
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                      className="hover:opacity-80 transition-opacity"
                    >
                      <img alt="Logo" src={logo} className="h-10 w-auto" />
                      
                    </button>
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex gap-[40px] items-center space-x-[60px]">
                      {navigation.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => handleScroll(item.href, close)}
                          className="block rounded-md px-3 py-2 text-[25px] font-medium text-gray-300 hover:text-white transition-colors"
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 sm:justify-around right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                          alt="Profile"
                          src={profile}
                          className="size-8 rounded-full"
                        />
                      </MenuButton>
                    </div>
                  </Menu>
                </div>
              </div>
            </div>
            {/* Mobile Menu with Pop-up Animation */}
            <Transition
              as={Fragment}
              show={open}
              enter="transition-all duration-300 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition-all duration-200 ease-in"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <DisclosurePanel
                className="sm:hidden fixed inset-0 flex items-center justify-center z-50"
                static
              >
                {/* Backdrop - clicking this will close the menu */}
                <div
                  className="absolute inset-0"
                  onClick={() => close()}
                  aria-hidden="true"
                />
                {/* Menu Card */}
                <div className="relative w-[80%] h-[45%] max-w-sm bg-blue-400 rounded-2xl shadow-xl border border-gray-500 overflow-hidden">
                  <div className="p-4">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                      <img src={logo} alt="Logo" className="h-12 w-auto" />
                    </div>
                    {/* Menu Column */}
                    <div className="flex flex-col space-y-2 ">
                      {navigation.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => handleScroll(item.href, close)}
                          className={classNames(
                            "flex items-center justify-center rounded-xl p-4",
                            "text-[25px] font-medium transition-all duration-300",
                            "hover:bg-gray-800 active:scale-95",
                            item.current
                              ? "bg-gray-800 text-white"
                              : "text-gray-900 hover:text-white"
                          )}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                    <br />
                    <br />
                    {/* <div className="flex justify-center mb-6">
                      <button className="bg-gray-800 text-white px-4 py-2 rounded-xl">
                        <FaFacebook />
                      </button>
                      <button className="bg-gray-800 text-white px-4 py-2 rounded-xl">
                        <FaInstagram />
                      </button>
                      <button className="bg-gray-800 text-white px-4 py-2 rounded-xl">
                        <FaLinkedin />
                      </button>
                    </div> */}
                  </div>
                </div>
              </DisclosurePanel>
            </Transition>
          </>
        )}
      </Disclosure>
    </Suspense>
  );
}
