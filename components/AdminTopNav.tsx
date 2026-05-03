export default function AdminTopNav() {
    return(
        <header className="h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6">
            <div className="md:hidden font-bold text-lg text-slate-800 dark:text-white">Admin</div>
            <div className="flex-1"></div>
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Admin User</span>
                <a href="/auth/logout" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:underline">
                    Logout
                </a>
            </div>
        </header>
    );
}