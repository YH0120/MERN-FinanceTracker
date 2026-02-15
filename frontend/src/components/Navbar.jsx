import { Link } from "react-router"
import { PlusIcon, Sun, Moon } from "lucide-react"
import { useAuthStore } from "../store/authStore"
import { useThemeStore } from "../store/themeStore"

const Navbar = () => {
    const { authUser, logout } = useAuthStore();
    const { theme, toggleTheme } = useThemeStore();

    return (
        <header className='bg-base-300 border-b border-base-content/10'>
            <div className='mx-auto max-w-6xl p-4'>
                <div className='flex items-center justify-between'>
                    <Link to="/" className='text-xl sm:text-3xl font-bold text-primary font-mono tracking-tight'>
                        FinanceTracker
                    </Link>
                    <div className='flex items-center gap-4'>
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="btn btn-ghost btn-circle btn-sm sm:btn-md"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? (
                                <Moon className="size-5" />
                            ) : (
                                <Sun className="size-5" />
                            )}
                        </button>

                        {authUser ? (
                            <>
                                <Link to={"/create"} className="btn btn-primary btn-sm sm:btn-md">
                                    <PlusIcon className="size-5" />
                                    <span className="hidden sm:inline">Add Transaction</span>
                                </Link>

                                <button onClick={logout} className="btn btn-neutral btn-sm sm:btn-md">
                                    <span className="hidden sm:inline">Log out</span>
                                    <span className="sm:hidden">Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to={"/login"} className="btn btn-neutral btn-sm sm:btn-md">
                                    Login
                                </Link>
                                <Link to={"/signup"} className="btn btn-primary btn-sm sm:btn-md">
                                    Sign Up
                                </Link>
                            </>
                        )}

                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar