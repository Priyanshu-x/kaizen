import logoImg from "../assets/logo.png";

export const Logo = ({ className = "h-8 w-8", showText = true }) => {


    return (
        <div className={`flex items-center gap-2 ${className.includes("text-") ? "" : "text-foreground"}`}>
            <img
                src={logoImg}
                alt="=2money Logo"
                className={`${className} object-contain`}
            />

            {showText && (
                <span className="font-heading font-bold text-xl tracking-tight text-current">
                    Kaizen
                </span>
            )}
        </div>
    );
};
