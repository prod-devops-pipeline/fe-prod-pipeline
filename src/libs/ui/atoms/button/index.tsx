export interface buttonProps {
    type?: 'button' | 'submit';
    className?: string;
    disabled?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    children?: string | React.ReactNode
}
function Button(props: buttonProps) {
    const { type, children, className, disabled, onClick = () => undefined, } = props;
    return (
        <>
            <button type={type} className={`py-2.5 px-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed ${className} `} disabled={disabled} onClick={(event) => onClick(event)}>
                {children}
            </button>
        </>
    )
}

export default Button
