import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  variant?: "default" | "footer" | "fullbleed";
};

export default function Container({
  children,
  variant = "default",
}: ContainerProps) {
  return (
    <div
      className={`container-shell ${
        variant === "footer" ? "container-footer" : ""
      } ${variant === "fullbleed" ? "container-fullbleed" : ""}`}
    >
      {children}
    </div>
  );
}
