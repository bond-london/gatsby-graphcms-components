import React from "react";

import { LinkRendererProps, LinkElement } from "@graphcms/rich-text-types";
import { GatsbyLinkProps, Link as GatsbyLink } from "gatsby";

export function ExternalLink({
  href,
  rel,
  id,
  title,
  openInNewTab,
  className,
  children,
}: LinkRendererProps): JSX.Element {
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
}

export function InternalLink({
  href,
  id,
  title,
  className,
  children,
}: LinkRendererProps): JSX.Element {
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
}

export function RTFLink(props: LinkRendererProps): JSX.Element {
  const { href } = props;
  if (href?.startsWith("/")) {
    return InternalLink(props);
  }
  return ExternalLink(props);
}
