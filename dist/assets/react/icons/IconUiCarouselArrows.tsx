import * as React from "react";
import type { SVGProps } from "react";
const SvgIconUiCarouselArrows = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 51 11"
    {...props}
  >
    <g id="icon_ui_carousel-arrows">
      <g id="icon_ui_carousel-arrows_2">
        <g id="color_stroke">
          <path
            id="Arrow_head_Lewa"
            fill="currentColor"
            d="m0 5.5 11-4.47L8.39 5.5 11 9.97z"
          />
          <path
            id="Arrow_tail_Lewa"
            stroke="currentColor"
            strokeWidth={1.8}
            d="M16.565 5.5H9"
          />
          <path
            id="Arrow_head_Prawa"
            fill="currentColor"
            d="M51 5.5 40 9.97l2.61-4.47L40 1.03z"
          />
          <path
            id="Arrow_tail_Prawa"
            stroke="currentColor"
            strokeWidth={1.8}
            d="M34.435 5.5H42"
          />
        </g>
      </g>
    </g>
  </svg>
);
export default SvgIconUiCarouselArrows;
