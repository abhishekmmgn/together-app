type propsType = {
  message: string;
  type: "sent" | "received";
};

export function Message(props: propsType) {
  return (
    <div
      className={`w-full flex items-center  ${
        props.type === "sent" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`w-fit max-w-[75%] py-[6px] px-[12px] rounded-[var(--radius)] ${
          props.type === "sent"
            ? "bg-primary text-white"
            : "bg-secondary text-secondary-foreground"
        }`}
      >
        {props.message}
      </div>
    </div>
  );
}
