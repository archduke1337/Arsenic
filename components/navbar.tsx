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
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Avatar,
    Link,
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect } from "react";
import { Sun, Moon, ChevronDown, Shield, Menu, Globe, Landmark, ScrollText, Mic2, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const { user, logout, isAdmin } = useAuth();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const menuItems = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Events", href: "/events" },
        { name: "Committees", href: "/committees" },
        { name: "Gallery", href: "/gallery" },
        { name: "Team", href: "/team" },
        { name: "Contact", href: "/contact" },
    ];

    const eventTypes = [
        { key: "mun", name: "Model UN", icon: <Globe size={20} className="text-blue-500" /> },
        { key: "lok-sabha", name: "Lok Sabha", icon: <Landmark size={20} className="text-orange-500" /> },
        { key: "rajya-sabha", name: "Rajya Sabha", icon: <ScrollText size={20} className="text-green-500" /> },
        { key: "debate", name: "Debate", icon: <Mic2 size={20} className="text-purple-500" /> },
        { key: "youth-parliament", name: "Youth Parliament", icon: <Users size={20} className="text-pink-500" /> },
    ];

    return (
        <NextUINavbar
            onMenuOpenChange={setIsMenuOpen}
            maxWidth="xl"
            className={`transition-all duration-500 ${scrolled
                ? "bg-white/85 dark:bg-black/85 backdrop-blur-2xl border-b border-black/5 dark:border-white/10 shadow-lg dark:shadow-black/20"
                : "bg-gradient-to-b from-white/10 dark:from-white/5 to-transparent border-b border-white/10 dark:border-white/5"
                }`}
            classNames={{
                item: [
                    "flex",
                    "relative",
                    "h-full",
                    "items-center",
                ],
            }}
            shouldHideOnScroll
        >
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                    icon={<Menu size={24} />}
                />
                <NavbarBrand>
                    <Link href="/" className="font-bold text-inherit flex items-center gap-3 group cursor-pointer">
                        <motion.div 
                            className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-700 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="text-sm font-extrabold">AS</span>
                            <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                        <div className="flex flex-col">
                            <span className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 tracking-tight">
                                ARSENIC
                            </span>
                            <span className="text-[9px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold -mt-0.5">
                                Summit 2024
                            </span>
                        </div>
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-6" justify="center">
                <NavbarItem>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button
                                disableRipple
                                className="p-0 bg-transparent data-[hover=true]:bg-transparent font-semibold text-base text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
                                endContent={<ChevronDown size={16} className="text-gray-500 transition-transform" />}
                                radius="sm"
                                variant="light"
                            >
                                Events
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Events"
                            className="w-[340px]"
                            itemClasses={{
                                base: "gap-4",
                            }}
                        >
                            {eventTypes.map((type) => (
                                <DropdownItem
                                    key={type.key}
                                    description={`Explore our ${type.name} simulations`}
                                    href={`/${type.key}`}
                                    startContent={type.icon}
                                    className="py-3"
                                >
                                    {type.name}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                </NavbarItem>

                {menuItems.slice(1).map((item) => (
                    <NavbarItem key={item.name} isActive={pathname === item.href}>
                        <Link
                            color={pathname === item.href ? "primary" : "foreground"}
                            href={item.href}
                            className="relative group font-semibold text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-blue-400 transition-colors py-2"
                        >
                            {item.name}
                            {pathname === item.href && (
                                <motion.div
                                    layoutId="navbar-indicator"
                                    className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </Link>
                    </NavbarItem>
                ))}

                {isAdmin && (
                    <NavbarItem>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href="/admin"
                                className="text-white font-bold flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 px-4 py-1.5 rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all"
                            >
                                <Shield size={16} />
                                <span className="text-sm">Admin</span>
                            </Link>
                        </motion.div>
                    </NavbarItem>
                )}
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem>
                    <motion.div
                        whileHover={{ rotate: 20 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Button
                            isIconOnly
                            variant="light"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            aria-label="Toggle theme"
                            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            {mounted && (theme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
                        </Button>
                    </motion.div>
                </NavbarItem>

                {user ? (
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                as="button"
                                className="transition-transform hover:scale-110 cursor-pointer ring-2 ring-offset-2 ring-primary/30"
                                color="primary"
                                name={user.name}
                                size="sm"
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                            <DropdownItem key="profile" className="h-14 gap-2">
                                <p className="font-semibold">Signed in as</p>
                                <p className="font-semibold text-primary text-sm">{user.email}</p>
                            </DropdownItem>
                            <DropdownItem key="dashboard" href="/dashboard" className="font-semibold">
                                Dashboard
                            </DropdownItem>
                            <DropdownItem key="settings" className="font-semibold">
                                My Settings
                            </DropdownItem>
                            <DropdownItem key="logout" color="danger" onPress={() => logout()} className="font-semibold">
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                ) : (
                    <>
                        <NavbarItem className="hidden lg:flex">
                            <Link 
                                href="/login" 
                                className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors font-semibold"
                            >
                                Login
                            </Link>
                        </NavbarItem>
                        <NavbarItem>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    as={Link}
                                    color="primary"
                                    href="/register"
                                    variant="shadow"
                                    className="font-bold bg-gradient-to-r from-blue-600 to-cyan-500 shadow-blue-500/40 hover:shadow-blue-500/60 text-white"
                                >
                                    Sign Up
                                </Button>
                            </motion.div>
                        </NavbarItem>
                    </>
                )}
            </NavbarContent>

            <NavbarMenu className="pt-6 bg-white/95 dark:bg-black/95 backdrop-blur-2xl border-t border-black/5 dark:border-white/10">
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                            color={pathname === item.href ? "primary" : "foreground"}
                            className="w-full text-lg font-bold py-3 hover:text-primary transition-colors"
                            href={item.href}
                            size="lg"
                        >
                            {item.name}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </NextUINavbar>
    );
}
