type propsType = {
  message: string;
};

export function MessageRecieved(props: propsType) {
  return (
    <div className="w-fit max-w-[75%] py-[6px] px-[12px] rounded-[var(--radius)] bg-tertiary text-secondary-foreground">
      {props.message}
    </div>
  );
}

export function MessageSent(props: propsType) {
  return (
    <div className="w-full flex items-center justify-end">
      <div className="w-fit max-w-[75%] py-[6px] px-[12px] rounded-[var(--radius)] bg-primary text-primary-foreground">
        {props.message}
      </div>
    </div>
  );
}
