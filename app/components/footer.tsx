import packageJSON from "@/../package.json";
import useLastCommitDate from "@/hooks/useLastCommitDate";
import { Spinner } from "./ui/spinner";

interface FooterProps {
  authors: Array<string>;
  additionalText?: string;
}

function Footer(props: FooterProps) {
  const version = packageJSON.version;
  const { lastCommitDate, loading } = useLastCommitDate(
    "mowi12/bierpongregeln",
  );
  const currentYear = new Date().getFullYear();

  let additionalTextElement = null;
  if (props.additionalText) {
    additionalTextElement = <p>{props.additionalText}</p>;
  }

  return (
    <footer className="p-5 flex flex-col items-center justify-center w-full">
      <p className="text-center flex items-center gap-1">
        Version {version} (Letztes Update:{" "}
        {loading ? <Spinner size="small" className="" /> : lastCommitDate})
      </p>
      <p className="text-center">
        Copyright &copy; {currentYear} {props.authors.join(", ")}.
      </p>
      {additionalTextElement}
    </footer>
  );
}

export default Footer;
