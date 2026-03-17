import type { ButtonHTMLAttributes } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = (props: ButtonProps): JSX.Element => {
  return (
    <button
      {...props}
      className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium"
    />
  );
};
