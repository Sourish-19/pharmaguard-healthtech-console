import { useRef, useEffect, useState, useMemo, useId, FC, PointerEvent } from 'react';

interface CurvedLoopProps {
    marqueeText?: string;
    speed?: number;
    className?: string;
    curveAmount?: number;
    direction?: 'left' | 'right';
    interactive?: boolean;
}

const CurvedLoop: FC<CurvedLoopProps> = ({
    marqueeText = '',
    speed = 0.5,
    className,
    curveAmount = 400,
    direction = 'left',
    interactive = true
}) => {
    const text = useMemo(() => {
        const hasTrailing = /\s|\u00A0$/.test(marqueeText);
        return (hasTrailing ? marqueeText.replace(/\s+$/, '') : marqueeText) + '\u00A0';
    }, [marqueeText]);

    const measureRef = useRef<SVGTextElement | null>(null);
    const textPathRef = useRef<SVGTextPathElement | null>(null);
    const pathRef = useRef<SVGPathElement | null>(null);
    const [spacing, setSpacing] = useState(0);
    const uid = useId();
    const pathId = `curve-${uid}`;
    const pathD = `M-100,40 Q500,${40 + curveAmount} 1540,40`;

    const dragRef = useRef(false);
    const lastXRef = useRef(0);
    const dirRef = useRef<'left' | 'right'>(direction);
    const velRef = useRef(0);

    const textLength = spacing;
    const totalText = textLength
        ? Array(Math.ceil(1800 / textLength) + 2)
            .fill(text)
            .join('')
        : text;
    const ready = spacing > 0;

    useEffect(() => {
        if (measureRef.current) setSpacing(measureRef.current.getComputedTextLength());
    }, [text, className]);

    useEffect(() => {
        if (!spacing) return;
        if (textPathRef.current) {
            const initial = -spacing;
            textPathRef.current.setAttribute('startOffset', initial + 'px');
        }
    }, [spacing]);

    useEffect(() => {
        if (!spacing || !ready) return;
        let frame: number;
        const step = () => {
            if (!dragRef.current && textPathRef.current) {
                const delta = dirRef.current === 'right' ? speed : -speed;
                const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');
                let newOffset = currentOffset + delta;
                const wrapPoint = spacing;
                if (newOffset <= -wrapPoint) newOffset += wrapPoint;
                if (newOffset > 0) newOffset -= wrapPoint;
                textPathRef.current.setAttribute('startOffset', newOffset + 'px');
            }
            frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [spacing, speed, ready]);

    const onPointerDown = (e: PointerEvent) => {
        if (!interactive) return;
        dragRef.current = true;
        lastXRef.current = e.clientX;
        velRef.current = 0;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
        if (!interactive || !dragRef.current || !textPathRef.current) return;
        const dx = e.clientX - lastXRef.current;
        lastXRef.current = e.clientX;
        velRef.current = dx;
        const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');
        let newOffset = currentOffset + dx;
        const wrapPoint = spacing;
        if (newOffset <= -wrapPoint) newOffset += wrapPoint;
        if (newOffset > 0) newOffset -= wrapPoint;
        textPathRef.current.setAttribute('startOffset', newOffset + 'px');
    };

    const endDrag = () => {
        if (!interactive) return;
        dragRef.current = false;
        dirRef.current = velRef.current > 0 ? 'right' : 'left';
    };

    const cursorStyle = interactive ? (dragRef.current ? 'grabbing' : 'grab') : 'auto';

    return (
        <div
            className="w-full h-[300px] flex items-center justify-center overflow-hidden"
            style={{ visibility: ready ? 'visible' : 'hidden', cursor: cursorStyle }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
        >
            <svg
                className="w-full min-w-[150vw] max-w-[200vw] h-full object-cover font-bold uppercase leading-none text-xl sm:text-2xl md:text-3xl lg:text-4xl"
                viewBox="0 0 1000 200"
                preserveAspectRatio="xMidYMid meet"
            >
                <text ref={measureRef} xmlSpace="preserve" style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none' }}>
                    {text}
                </text>
                <defs>
                    <path ref={pathRef} id={pathId} d={`M -200 100 Q 500 ${100 + curveAmount / 4} 1200 100`} fill="none" stroke="transparent" />
                </defs>
                {ready && (
                    <text xmlSpace="preserve" className={`fill-white ${className ?? ''}`}>
                        <textPath ref={textPathRef} href={`#${pathId}`} startOffset="0px" xmlSpace="preserve">
                            {totalText}
                        </textPath>
                    </text>
                )}
            </svg>
        </div>
    );
};

export default CurvedLoop;
