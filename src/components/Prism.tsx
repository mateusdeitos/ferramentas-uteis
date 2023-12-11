import { Prism as _Prism } from "@mantine/prism";
// @ts-ignore
import PrismRenderer from "prism-react-renderer/prism";
// @ts-ignore
(typeof global !== "undefined" ? global : window).Prism = PrismRenderer;

require("prismjs/components/prism-php");
require("prismjs/components/prism-css");
require("prismjs/components/prism-typescript");

export const Prism = _Prism;
