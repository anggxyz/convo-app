import type { ButtonHTMLAttributes } from "react";

const Button = ({
  handleClick,
  disabled,
  buttonText,
  displayLoading,
  className,
  type = "button",
}: {
  handleClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  buttonText: string;
  displayLoading?: boolean;
  className?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
}) => {
  return (
    <button
      className={`
        ${
          disabled
            ? `
          cursor-not-allowed
          bg-gray-400
          text-gray-600`
            : `
          bg-kernel
          text-gray-200
          hover:shadow-outline
          `
        }
        rounded-xl
        py-2
        px-16
        font-secondary
        text-lg
        uppercase
        drop-shadow-xl
        transition-shadow
        duration-300
        ease-in-out
        hover:shadow-md
        ${` ` + className}
      `}
      onClick={handleClick}
      disabled={disabled}
      type={type}
    >
      <div className="flex flex-row items-center justify-center gap-4">
        {displayLoading ? (
          <span className="h-2 w-2 animate-ping rounded-full bg-highlight"></span>
        ) : null}
        <div>{buttonText}</div>
      </div>
    </button>
  );
};
export default Button;
