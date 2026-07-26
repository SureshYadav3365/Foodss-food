import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children, hideFooter = false }) => (
  <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
    <Navbar />
    <main className="flex-1 w-full overflow-x-hidden">{children}</main>
    {!hideFooter && <Footer />}
  </div>
);

export default Layout;
