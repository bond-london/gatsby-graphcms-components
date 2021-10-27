import React from "react";

import { LinkRendererProps, LinkElement } from "@graphcms/rich-text-types";
import { GatsbyLinkProps, Link as GatsbyLink } from "gatsby";

export const ExternalLink: React.FC<LinkRendererProps> = ({
  href,
  rel,
  id,
  title,
  openInNewTab,
  className,
  children,
}) => {
  const props: Pick<LinkElement, "rel" | "id" | "title" | "className"> & {
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

export const InternalLink: React.FC<LinkRendererProps> = ({
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

export const RTFLink: React.FC<LinkRendererProps> = (props) => {
  const { href } = props;
  if (href?.startsWith("/")) {
    return <InternalLink {...props} />;
  }
  return <ExternalLink {...props} />;
};
