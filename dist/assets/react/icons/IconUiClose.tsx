import * as React from "react";
import type { SVGProps } from "react";
const SvgIconUiClose = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <g id="icon_ui_close" clipPath="url(#a)">
      <g id="icon_ui_close_2">
        <g id="icon_ui_close_3">
          <g id="color_stroke">
            <path
              id="Cross"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth={1.5}
              d="m2.625 2.625 18.75 18.75m0-18.75-18.75 18.75"
            />
          </g>
        </g>
      </g>
    </g>
    <defs>
      <clipPath id="a">
        <path fill="currentColor" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgIconUiClose;
