export function Container({
  children,
  className = "",
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={`mx-auto w-full max-w-[90rem] px-5 sm:px-8 lg:px-12 ${className}`}
    >
      {children}
    </div>
  );
}
