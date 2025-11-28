"use client";

import {
    Navbar as HeroUINavbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    Button,
    Link,
<<<<<<< Updated upstream
} from "@nextui-org/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar
} from "@nextui-org/react";

=======
} from "@heroui/react";
>>>>>>> Stashed changes
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect } from "react";
import { Sun, Moon, ChevronDown, Shield, Menu, Globe, Landmark, ScrollText, Mic2, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const { user, logout, isAdmin } = useAuth();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isEventsOpen, setIsEventsOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
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
    ];

    return (
        <HeroUINavbar
            onMenuOpenChange={setIsMenuOpen}
            maxWidth="xl"
            height="70px"
            className={`fixed transition-all duration-300 ${
                scrolled
                    ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm"
                    : "bg-transparent"
            }`}
            classNames={{
                wrapper: "px-6 sm:px-8",
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
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative w-10 h-10"
                        >
                            <Image
                                src="/logo.png"
                                alt="ARSENIC Summit"
                                width={40}
                                height={40}
                                className="object-contain"
                            />
                        </motion.div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
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
                            className={`px-4 h-10 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-[15px] transition-all ${
                                pathname.includes('/mun') || pathname.includes('/sabha') || pathname.includes('/debate') || pathname.includes('/parliament')
                                    ? 'text-gray-900 dark:text-white'
                                    : 'text-gray-600 dark:text-gray-300'
                            }`}
                            endContent={
                                <motion.div
                                    animate={{ rotate: isEventsOpen ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronDown size={16} />
                                </motion.div>
                            }
                            radius="lg"
                            variant="light"
                        >
                            Events
                        </Button>

                        {/* Custom Dropdown */}
                        <AnimatePresence>
                            {isEventsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50"
                                >
                                    <div className="p-2">
                                        {eventTypes.map((type, index) => (
                                            <motion.a
                                                key={type.key}
                                                href={`/${type.key}`}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                                            >
                                                <div className="mt-0.5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {type.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900 dark:text-white text-sm mb-0.5">
                                                        {type.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
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
                            className={`px-4 h-10 flex items-center rounded-lg font-medium text-[15px] transition-all hover:bg-gray-100 dark:hover:bg-gray-800 ${
                                pathname === item.href
                                    ? 'text-gray-900 dark:text-white'
                                    : 'text-gray-600 dark:text-gray-300'
                            }`}
                        >
                            {item.name}
                        </Link>
                    </NavbarItem>
                ))}

                {isAdmin && (
                    <NavbarItem>
                        <Link
                            href="/admin"
                            className="px-4 h-10 flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-[15px] hover:shadow-lg hover:shadow-orange-500/25 transition-all"
                        >
                            <Shield size={16} />
                            Admin
                        </Link>
                    </NavbarItem>
                )}
            </NavbarContent>

            {/* Right Section */}
            <NavbarContent justify="end" className="gap-2">
                <NavbarItem>
                    <Button
                        isIconOnly
                        variant="light"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        aria-label="Toggle theme"
                        className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        radius="lg"
                    >
                        {mounted && (theme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
                    </Button>
                </NavbarItem>

                {user ? (
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Avatar
                                as="button"
                                className="transition-transform hover:scale-105 cursor-pointer"
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
                            <DropdownItem key="settings">
                                My Settings
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
                                className="px-4 h-10 flex items-center rounded-lg font-medium text-[15px] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                            >
                                Login
                            </Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Button
                                as={Link}
                                href="/register"
                                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold text-[15px] hover:opacity-90 transition-opacity"
                                radius="lg"
                                size="sm"
                            >
                                Sign Up
                            </Button>
                        </NavbarItem>
                    </>
                )}
            </NavbarContent>

            {/* Mobile Menu */}
            <NavbarMenu className="pt-6 gap-2">
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                            href={item.href}
                            className={`w-full text-lg font-semibold py-2 transition-colors ${
                                pathname === item.href
                                    ? 'text-gray-900 dark:text-white'
                                    : 'text-gray-600 dark:text-gray-300'
                            }`}
                            size="lg"
                        >
                            {item.name}
                        </Link>
                    </NavbarMenuItem>
                ))}
                
                <NavbarMenuItem>
                    <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4">
                        Events
                    </div>
                    {eventTypes.map((type) => (
                        <Link
                            key={type.key}
                            href={`/${type.key}`}
                            className="w-full flex items-center gap-3 text-base font-medium py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            {type.icon}
                            {type.name}
                        </Link>
                    ))}
                </NavbarMenuItem>
            </NavbarMenu>
        </HeroUINavbar>
    );
}