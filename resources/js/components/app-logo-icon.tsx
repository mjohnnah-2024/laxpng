import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
            <path d="M16.07 4.92L19.41 6.85c.33.19.33.67 0 .86L12 12l-4.07-2.36L16.07 4.92z" fill="#AB9BFF" />
            <path d="M12 12l4.07 2.36-8.15 4.72L3.85 16.72 12 12z" fill="#00EBD2" />
            <path d="M20.15 16.72l-4.07-2.36-8.15 4.72 4.07 2.36 8.15-4.72z" fill="#00CFCA" />
            <path d="M3.85 7.28l4.07 2.36 8.15-4.72L12 2.56" fill="#7347FF" />
            <path d="M7.93 9.64v4.72L12 12 7.93 9.64z" fill="#1C54E4" />
            <path d="M20.14 12.84l.01 3.88-4.07-2.36 3.32-1.94c.33-.19.74.04.74.42z" fill="#00EBD2" />
            <path d="M3.85 7.28l4.07 2.36v4.72L3.85 16.72V7.28z" fill="#0423DB" />
            <path d="M12 0L22.39 6v12L12 24 1.61 18V6L12 0z" fill="#FFFFFF" fillOpacity="0.1" />
        </svg>
    );
}
