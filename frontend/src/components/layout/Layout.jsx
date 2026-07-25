import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children, hideFooter = false }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    {!hideFooter && <Footer />}
  </div>
);

export default Layout;
