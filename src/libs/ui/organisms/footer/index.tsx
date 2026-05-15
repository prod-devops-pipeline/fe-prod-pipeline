

const Footer: React.FC = () => {

    return (
        <footer className=" w-full  bg-zinc-950 text-zinc-400  pb-8 px-6 ">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 text-xs text-white">
                    <span>© {new Date().getFullYear()} Acme Inc. All rights reserved.</span>
                    <div className="flex gap-5">
                        <a href="#" className="hover:text-zinc-400 transition-colors duration-150">Privacy</a>
                        <a href="#" className="hover:text-zinc-400 transition-colors duration-150">Terms</a>
                        <a href="#" className="hover:text-zinc-400 transition-colors duration-150">Cookies</a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
