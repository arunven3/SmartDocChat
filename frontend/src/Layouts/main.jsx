import React from "react";

const Header = () => {
  return (
    <header className="header">
      <p>SmartDocChat</p>
    </header>
  );
};

const Container = ({ children }) => {
  return <div className="container">{children}</div>;
}

const Footer = () => {
  return (
    <footer className="footer">
      {/* <p>© 2023 SmartDocChat. All rights reserved.</p> */}
    </footer>
  );
}

export const MainLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <Container>
        {children}
      </Container>
      <Footer />
    </div>
  );
}

