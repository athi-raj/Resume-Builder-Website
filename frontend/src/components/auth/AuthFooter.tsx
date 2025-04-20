
import React from 'react';
import { Link } from 'react-router-dom';

interface AuthFooterProps {
  text: string;
  linkText: string;
  linkTo: string;
}

const AuthFooter = ({ text, linkText, linkTo }: AuthFooterProps) => {
  return (
    <div className="mt-8 text-center">
      <p className="text-sm text-muted-foreground">
        {text}{" "}
        <Link to={linkTo} className="text-primary font-medium hover:underline">
          {linkText}
        </Link>
      </p>
    </div>
  );
};

export default AuthFooter;
