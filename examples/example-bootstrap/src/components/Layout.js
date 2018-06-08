import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';

export const Container = ({ children, ...props }) => (
  <div className="container" {...props}>
    {children}
  </div>
);

export const Header = ({ children }) => {
  return (
    <header className="header">
      <h1>{children}</h1>
    </header>
  );
};

export const Title = ({ children }) => <Fragment>{children}</Fragment>;

export const Small = ({ children }) => (
  <small className="text-muted font-weight-light d-block">{children}</small>
);

export const Main = ({ children }) => (
  <div className="main">{children}</div>
);

export const Menu = ({ children }) => (
  <div>{children}</div>
);

export const Nav = ({ children, ...props }) => {
  return (
    <nav {...props}>
      <ul className="nav nav-pills">{children}</ul>
    </nav>
  );
};

export const Link = ({ children, ...props }) => {
  return (
    <NavLink className="nav-link" activeClassName="active" {...props}>
      {children}
    </NavLink>
  );
};

export const Content = ({ children }) => (
  <section className="content">{children}</section>
);
