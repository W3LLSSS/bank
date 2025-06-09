import { ChangeCurrency } from "../functions/ChangeCurrency"
import DarkModeToggle from "../functions/DarkMode"

export const Header = () => {
    return (
        <>
            {/* Nav para pantallas medianas en adelante */}
            <nav className="hidden md:flex justify-between items-center bg-green-500 text-white px-6 py-4 shadow-md">
                <h1 className="text-xl font-bold">Bank</h1>
                <ul className="flex gap-6 text-sm font-medium">
                    <ChangeCurrency />
                    <DarkModeToggle />
                </ul>
            </nav>

            {/* Header móvil */}
            <div className="bg-black">
                <header className="md:hidden fixed top-0 left-0 right-0 bg-green-400 text-white p-4 shadow-md z-10 flex justify-between items-center">
                    <h1 className="text-lg font-semibold">Bank</h1>
                    <div className="flex gap-3 items-center">
                        <div className="scale-75">
                            <ChangeCurrency />
                        </div>
                            <DarkModeToggle />
                    </div>
                </header>
            </div>

            {/* Espacio para evitar que el header móvil tape contenido */}
            <div className="h-[4.5rem] md:hidden" />
        </>
    );
};
