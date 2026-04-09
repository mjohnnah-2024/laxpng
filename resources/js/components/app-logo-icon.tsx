import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
            <path d="M16.07 4.92L19.41 6.85c.33.19.33.67 0 .86L12 12l-4.07-2.36L16.07 4.92z" fill="currentColor" opacity="0.5" />
            <path d="M12 12l4.07 2.36-8.15 4.72L3.85 16.72 12 12z" fill="currentColor" opacity="0.65" />
            <path d="M20.15 16.72l-4.07-2.36-8.15 4.72 4.07 2.36 8.15-4.72z" fill="currentColor" opacity="0.6" />
            <path d="M3.85 7.28l4.07 2.36 8.15-4.72L12 2.56" fill="currentColor" />
            <path d="M7.93 9.64v4.72L12 12 7.93 9.64z" fill="currentColor" opacity="0.75" />
            <path d="M20.14 12.84l.01 3.88-4.07-2.36 3.32-1.94c.33-.19.74.04.74.42z" fill="currentColor" opacity="0.65" />
            <path d="M3.85 7.28l4.07 2.36v4.72L3.85 16.72V7.28z" fill="currentColor" opacity="0.85" />
            <path d="M12 0L22.39 6v12L12 24 1.61 18V6L12 0z" fill="currentColor" opacity="0.1" />
        </svg>
    );
}
