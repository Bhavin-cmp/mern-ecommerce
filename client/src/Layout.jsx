// Layout.jsx
import Header from "./components/Header";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 md:px-8">{children}</main>
    </div>
  );
};

export default Layout;
