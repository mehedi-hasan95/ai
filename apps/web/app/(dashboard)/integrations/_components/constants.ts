import { RiNextjsFill } from "react-icons/ri";
import { FaHtml5, FaReact, FaWordpressSimple } from "react-icons/fa6";
import { SiJavascript } from "react-icons/si";

export const INTEGRATIONS_OPTION = [
  {
    id: "html",
    title: "HTML",
    icon: FaHtml5,
    className: "text-[#E65100]",
  },
  {
    id: "javascript",
    title: "JavaScript",
    icon: SiJavascript,
    className: "text-yellow-400",
  },
  {
    id: "react",
    title: "React",
    icon: FaReact,
    className: "text-blue-400",
  },
  {
    id: "nextjs",
    title: "Next.Js",
    icon: RiNextjsFill,
  },
  {
    id: "wordpress",
    title: "WordPress",
    icon: FaWordpressSimple,
    className: "text-blue-400",
  },
];

export type IntegrationId = (typeof INTEGRATIONS_OPTION)[number]["id"];

export const HTML_SCRIPT = `<script src="https://mehedifi-widget.vercel.app/widget.js" data-organization-id="{{ORGANIZATION_ID}}"></script>`;
export const JAVASCRIPT_SCRIPT = `<script src="https://mehedifi-widget.vercel.app/widget.js" data-organization-id="{{ORGANIZATION_ID}}"></script>`;
export const REACT_SCRIPT = `<script src="https://mehedifi-widget.vercel.app/widget.js" data-organization-id="{{ORGANIZATION_ID}}"></script>`;
export const NEXTJS_SCRIPT = `<script src="https://mehedifi-widget.vercel.app/widget.js" data-organization-id="{{ORGANIZATION_ID}}"></script>`;
export const WORDPRESS_SCRIPT = `<script src="https://mehedifi-widget.vercel.app/widget.js" data-organization-id="{{ORGANIZATION_ID}}"></script>`;
