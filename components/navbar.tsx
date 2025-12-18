"use client";

import {
    Navbar as NextUINavbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    Button,
    Link,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Avatar,
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect } from "react";
import { ChevronDown, Menu, Globe, Landmark, ScrollText, Mic2, Users, Calendar } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative w-12 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center px-1 transition-colors duration-300 focus:outline-none ring-offset-2 focus:ring-2 ring-blue-500/50 overflow-hidden"
            aria-label="Toggle Theme"
        >
            <motion.div
                className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/10"
                initial={false}
                animate={{
                    opacity: isDark ? 1 : 0
                }}
            />

            {/* Sun/Moon Icon Wrapper */}
            <motion.div
                className="relative z-10 w-6 h-6 flex items-center justify-center text-zinc-800 dark:text-zinc-100"
                initial={false}
                animate={{
                    x: isDark ? 16 : 0,
                    rotate: isDark ? 0 : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <AnimatePresence mode="wait" initial={false}>
                    {isDark ? (
                        <motion.svg
                            key="moon"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                        >
                            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                        </motion.svg>
                    ) : (
                        <motion.svg
                            key="sun"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ scale: 0.5, opacity: 0, rotate: 90 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.5, opacity: 0, rotate: -90 }}
                            transition={{ duration: 0.2 }}
                        >
                            <circle cx="12" cy="12" r="4" />
                            <path d="M12 2v2" />
                            <path d="M12 20v2" />
                            <path d="m4.93 4.93 1.41 1.41" />
                            <path d="m17.66 17.66 1.41 1.41" />
                            <path d="M2 12h2" />
                            <path d="M20 12h2" />
                            <path d="m6.34 17.66-1.41 1.41" />
                            <path d="m19.07 4.93-1.41 1.41" />
                        </motion.svg>
                    )}
                </AnimatePresence>
            </motion.div>
        </button>
    );
};

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [isEventsOpen, setIsEventsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const menuItems = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Committees", href: "/committees" },
        { name: "Gallery", href: "/gallery" },
        { name: "Team", href: "/team" },
        { name: "Contact", href: "/contact" },
    ];

    const eventTypes = [
        { key: "mun", name: "Model UN", icon: <Globe size={18} />, description: "International diplomacy simulation" },
        { key: "lok-sabha", name: "Lok Sabha", icon: <Landmark size={18} />, description: "Lower house parliamentary debates" },
        { key: "rajya-sabha", name: "Rajya Sabha", icon: <ScrollText size={18} />, description: "Upper house legislative proceedings" },
        { key: "debate", name: "Debate", icon: <Mic2 size={18} />, description: "Competitive argumentation forums" },
        { key: "youth-parliament", name: "Youth Parliament", icon: <Users size={18} />, description: "Democratic youth engagement" },
        { key: "events", name: "Events Calendar", icon: <Calendar size={18} />, description: "Full schedule of upcoming summits" },
    ];

    return (
        <NextUINavbar
            onMenuOpenChange={setIsMenuOpen}
            maxWidth="xl"
            height="auto"
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-in-out py-2 bg-transparent`}
            classNames={{
                wrapper: "px-0",
            }}
        >
            {/* Floating Container */}
            <motion.div
                initial={false}
                animate={{
                    width: scrolled ? "90%" : "100%",
                    borderRadius: scrolled ? "9999px" : "0px",
                    y: scrolled ? 10 : 0,
                }}
                className={`mx-auto flex items-center justify-between px-6 py-2 transition-all duration-300 backdrop-blur-xl ${scrolled
                    ? "bg-white/80 dark:bg-black/80 shadow-lg border border-white/20 dark:border-white/10"
                    : ""
                    }`}
                style={{
                    maxWidth: scrolled ? "1200px" : "none",
                }}
            >
                {/* Logo Section */}
                <NavbarContent>
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        className="sm:hidden text-gray-700 dark:text-gray-300"
                        icon={<Menu size={24} />}
                    />
                    <NavbarBrand>
                        <Link href="/" className="flex items-center gap-3 group">
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative w-10 h-10"
                            >
                                <Image
                                    src="/logo.png"
                                    alt="ARSENIC Summit"
                                    width={40}
                                    height={40}
                                    className="object-contain drop-shadow-lg"
                                />
                            </motion.div>
                            <div className="hidden sm:flex flex-col">
                                <span className={`text-xl font-bold tracking-tight transition-colors ${scrolled ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'}`}>
                                    ARSENIC
                                </span>
                                <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium -mt-1">
                                    Summit 2024
                                </span>
                            </div>
                        </Link>
                    </NavbarBrand>
                </NavbarContent>

                {/* Desktop Menu */}
                <NavbarContent className="hidden lg:flex gap-1" justify="center">
                    <NavbarItem>
                        <div
                            className="relative"
                            onMouseEnter={() => setIsEventsOpen(true)}
                            onMouseLeave={() => setIsEventsOpen(false)}
                        >
                            <Button
                                disableRipple
                                as={Link}
                                href="/events"
                                className={`px-4 h-9 bg-transparent hover:bg-black/5 dark:hover:bg-white/10 font-medium text-[15px] transition-all rounded-full ${pathname.includes('/mun') || pathname.includes('/sabha') || pathname === '/events'
                                    ? 'text-blue-600 dark:text-blue-400 font-semibold'
                                    : scrolled ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'
                                    }`}
                                endContent={
                                    <motion.div
                                        animate={{ rotate: isEventsOpen ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronDown size={14} />
                                    </motion.div>
                                }
                            >
                                Events
                            </Button>

                            <AnimatePresence>
                                {isEventsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden z-[60]"
                                    >
                                        <div className="p-2 space-y-1">
                                            {eventTypes.map((type, index) => (
                                                <motion.a
                                                    key={type.key}
                                                    href={`/${type.key}`}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors group"
                                                >
                                                    <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                                                        {type.icon}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 dark:text-white text-sm">
                                                            {type.name}
                                                        </div>
                                                        <div className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1">
                                                            {type.description}
                                                        </div>
                                                    </div>
                                                </motion.a>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </NavbarItem>

                    {menuItems.slice(1).map((item) => (
                        <NavbarItem key={item.name}>
                            <Link
                                href={item.href}
                                className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors hover:text-gray-900 dark:hover:text-white ${pathname === item.href
                                    ? 'text-gray-900 dark:text-white font-semibold'
                                    : scrolled ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'
                                    }`}
                            >
                                {pathname === item.href && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute inset-0 bg-black/5 dark:bg-white/10 rounded-full -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                {item.name}
                            </Link>
                        </NavbarItem>
                    ))}
                </NavbarContent>

                {/* Right Section */}
                <NavbarContent justify="end" className="gap-4">
                    <NavbarItem>
                        <ThemeToggle />
                    </NavbarItem>

                    {user ? (
                        <Dropdown placement="bottom-end">
                            <DropdownTrigger>
                                <Avatar
                                    as="button"
                                    className="transition-transform hover:scale-105 ring-2 ring-transparent hover:ring-blue-500 ring-offset-2 ring-offset-transparent"
                                    color="primary"
                                    name={user.name}
                                    size="sm"
                                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Profile Actions" variant="flat">
                                <DropdownItem key="profile" className="h-14 gap-2" textValue="Profile">
                                    <p className="font-semibold">Signed in as</p>
                                    <p className="font-semibold text-primary text-sm">{user.email}</p>
                                </DropdownItem>
                                <DropdownItem key="dashboard" href="/dashboard">
                                    Dashboard
                                </DropdownItem>
                                <DropdownItem key="logout" color="danger" onPress={() => logout()}>
                                    Log Out
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    ) : (
                        <>
                            <NavbarItem className="hidden sm:flex">
                                <Link
                                    href="/login"
                                    className={`text-sm font-medium transition-colors ${scrolled ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'
                                        } hover:text-blue-600 dark:hover:text-blue-400`}
                                >
                                    Login
                                </Link>
                            </NavbarItem>
                            <NavbarItem>
                                <Button
                                    as={Link}
                                    href="/register"
                                    className="bg-gray-900 dark:bg-white text-white dark:text-black font-semibold text-sm h-9 px-4 rounded-full shadow-lg shadow-gray-500/20 dark:shadow-white/20 hover:shadow-gray-500/40 hover:-translate-y-0.5 transition-all"
                                >
                                    Sign Up
                                </Button>
                            </NavbarItem>
                        </>
                    )}
                </NavbarContent>

                {/* Mobile Menu */}
                <NavbarMenu className="pt-8 gap-4 bg-white/90 dark:bg-black/95 backdrop-blur-xl">
                    {menuItems.map((item, index) => (
                        <NavbarMenuItem key={`${item}-${index}`}>
                            <Link
                                href={item.href}
                                className="w-full text-2xl font-bold py-2 text-gray-900 dark:text-white"
                            >
                                {item.name}
                            </Link>
                        </NavbarMenuItem>
                    ))}

                    <div className="h-px bg-gray-200 dark:bg-white/10 my-2" />

                    <div className="grid grid-cols-2 gap-3">
                        {eventTypes.map((type) => (
                            <Link
                                key={type.key}
                                href={`/${type.key}`}
                                className="flex flex-col gap-2 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 active:scale-95 transition-all"
                            >
                                <div className="text-blue-600 dark:text-blue-400">
                                    {type.icon}
                                </div>
                                <span className="font-semibold text-sm text-gray-900 dark:text-white">
                                    {type.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </NavbarMenu>
            </motion.div>
        </NextUINavbar>
    );
}
