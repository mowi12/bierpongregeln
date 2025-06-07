interface HighlightProps {
  children: React.ReactNode;
}

export default function Highlight(props: HighlightProps) {
  const { children } = props;
  return <span style={{ color: "rgb(0, 200, 110)" }}>{children}</span>;
}
