// Stub for `next-intl/navigation`. Returns no-op router primitives so
// imports resolve without parsing the upstream ESM file.

const React = require("react");

const Link = ({ href, children, ...rest }) =>
  React.createElement("a", { href: String(href), ...rest }, children);

const useRouter = () => ({
  push: () => {},
  replace: () => {},
  prefetch: () => {},
  back: () => {},
});

module.exports = {
  createNavigation: () => ({
    Link,
    redirect: () => {},
    usePathname: () => "/",
    useRouter,
    getPathname: ({ href }) => href,
  }),
};
