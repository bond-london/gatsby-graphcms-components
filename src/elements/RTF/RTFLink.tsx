import React from "react";

import { GatsbyLinkProps, Link as GatsbyLink } from "gatsby";
import { LinkNodeRendererProps } from "@bond-london/graphcms-rich-text";

export const ExternalLink: React.FC<LinkNodeRendererProps> = ({
  href,
  rel,
  id,
  title,
  openInNewTab,
  className,
  children,
}) => {
  const props: Pick<
    React.DetailedHTMLProps<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >,
    "rel" | "id" | "title" | "className"
  > & {
    target?: string;
  } = {};

  if (rel) props.rel = rel;
  if (id) props.id = id;
  if (title) props.title = title;
  if (className) props.className = className;
  if (openInNewTab) props.target = "_blank";

  return (
    <a href={encodeURI(href || "/")} {...props}>
      {children}
    </a>
  );
};

export const InternalLink: React.FC<LinkNodeRendererProps> = ({
  href,
  id,
  title,
  className,
  children,
}) => {
  const props: Pick<
    GatsbyLinkProps<unknown>,
    "id" | "title" | "className"
  > = {};

  if (id) props.id = id;
  if (title) props.title = title;
  if (className) props.className = className;

  return (
    <GatsbyLink to={href || "/"} {...props}>
      {children}
    </GatsbyLink>
  );
};

export const RTFLink: React.FC<LinkNodeRendererProps> = (props) => {
  const { href } = props;
  if (href?.startsWith("/")) {
    return <InternalLink {...props} />;
  }
  return <ExternalLink {...props} />;
};
