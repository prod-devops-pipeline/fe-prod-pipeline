import { Outlet } from "react-router-dom";
import Header from "../../libs/ui/organisms/header";
import Footer from "../../libs/ui/organisms/footer";

function MainModule() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* header section */}
      <nav className="w-full fixed z-50 left-0 top-0 bg-white">
        <Header />
      </nav>

      {/* main section */}
      <main className="flex-grow pt-20">
        <Outlet />
      </main>

      {/* Footer Section  */}
      <footer className="w-full border-t">
        <Footer />
      </footer>
    </div>
  );
}

export default MainModule;
