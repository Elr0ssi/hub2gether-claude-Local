declare module "react-simple-maps" {
  import type { ReactNode, SVGAttributes, MouseEvent as ReactMouseEvent } from "react";

  interface ProjectionConfig {
    center?: [number, number];
    scale?: number;
    rotate?: [number, number, number];
    parallels?: [number, number];
  }

  interface ComposableMapProps extends SVGAttributes<SVGSVGElement> {
    projection?: string;
    projectionConfig?: ProjectionConfig;
    width?: number;
    height?: number;
    style?: React.CSSProperties;
  }

  interface GeographiesProps {
    geography: string | object;
    children: (props: { geographies: GeographyItem[] }) => ReactNode;
    parseGeographies?: (features: unknown[]) => unknown[];
  }

  interface GeographyItem {
    rsmKey: string;
    [key: string]: unknown;
  }

  interface GeographyProps extends SVGAttributes<SVGPathElement> {
    geography: GeographyItem;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    onClick?: (event: ReactMouseEvent<SVGPathElement>) => void;
    onMouseEnter?: (event: ReactMouseEvent<SVGPathElement>) => void;
    onMouseLeave?: (event: ReactMouseEvent<SVGPathElement>) => void;
    onMouseMove?: (event: ReactMouseEvent<SVGPathElement>) => void;
    style?: {
      default?: React.CSSProperties & { outline?: string; cursor?: string; filter?: string };
      hover?: React.CSSProperties & { outline?: string; cursor?: string; filter?: string };
      pressed?: React.CSSProperties & { outline?: string };
    };
  }

  interface MarkerProps extends SVGAttributes<SVGGElement> {
    coordinates: [number, number];
    children?: ReactNode;
  }

  export function ComposableMap(props: ComposableMapProps): JSX.Element;
  export function Geographies(props: GeographiesProps): JSX.Element;
  export function Geography(props: GeographyProps): JSX.Element;
  interface ZoomableGroupProps {
    zoom?: number;
    center?: [number, number];
    onMoveEnd?: (position: { coordinates: [number, number]; zoom: number }) => void;
    filterZoomEvent?: (event: WheelEvent) => boolean;
    translateExtent?: [[number, number], [number, number]];
    children?: ReactNode;
  }

  export function ZoomableGroup(props: ZoomableGroupProps): JSX.Element;
  export function Sphere(props: SVGAttributes<SVGPathElement>): JSX.Element;
  export function Graticule(props: SVGAttributes<SVGPathElement>): JSX.Element;
  export function Marker(props: MarkerProps): JSX.Element;
}
